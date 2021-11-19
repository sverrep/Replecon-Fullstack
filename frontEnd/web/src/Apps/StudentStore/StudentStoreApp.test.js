import React from 'react';
import ReactDom from 'react-dom';
import StudentStoreApp from './StudentStoreApp.js'
import renderer from 'react-test-renderer'
import axios from 'axios'

jest.mock('axios');
let wrapper
const props = {
    location:{
        state:{
            role: "Student",
            token: 'Token'
        }
    }  
}


describe('Student Store Tests', ()=>{
    
    beforeEach(() => {
        wrapper = shallow(<StudentStoreApp.WrappedComponent {...props}/>, { disableLifecycleMethods: true })
    });
    
    describe('Student Page renders', ()=>{
        it('should render page properly',()=>{
            expect(wrapper.getElements()).toMatchSnapshot();
        })

        it('should render cards properly', ()=>{
            const instance = wrapper.instance()
            expect(instance.renderCard({shop_id: '12', item_name: 'item name', price: '60', description: 'description'})).toMatchSnapshot();
        })
    })

    describe('Component did mount function', ()=>{
        it('component did mount should call other functions', async()=>{
            const instance = wrapper.instance()
            
            instance.getClassCode = jest.fn()
            instance.getClassCode.mockReturnValueOnce()

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockReturnValueOnce()
            
            await instance.componentDidMount()

            expect(instance.getClassCode).toHaveBeenCalledTimes(1)
            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
        })
    })

    describe('Component Mounted Unit Tests', ()=>{
        it('Should get class codes', async()=>{
            const instance = wrapper.instance()
            
            const users = mockResponseData([{id: '1', class_code: '123'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(users))
            
            instance.getShops = jest.fn()
            instance.getShops.mockReturnValueOnce()

            await instance.getClassCode()
            expect(instance.state.students).toStrictEqual([{id: '1', class_code: '123'}])
            expect(instance.state.class_code).toBe('123')
            expect(instance.getShops).toHaveBeenCalledTimes(1)
        })

        it('should get shops', async()=>{
            const instance = wrapper.instance()

            const shops = mockResponseData([{class_code: '123', shop_name: 'shop name', id: '12'}, {class_code: '34', shop_name: 'shop name2', id: '122'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))

            instance.findShopName = jest.fn()
            instance.findShopName.mockReturnValueOnce()

            await instance.getShops()

            expect(instance.state.shops).toStrictEqual([{class_code: '123', shop_name: 'shop name', id: '12'}, {class_code: '34', shop_name: 'shop name2', id: '122'}])
            expect(instance.findShopName).toHaveBeenCalledTimes(1)
        })

        it('should find shop name', async()=>{
            const instance = wrapper.instance()
            instance.state.class_code = '34'
            const shops = [{class_code: '123', shop_name: 'shop name', id: '12'}, {class_code: '34', shop_name: 'shop name2', id: '122'}]
            
            instance.getItems = jest.fn()
            instance.getItems.mockReturnValueOnce()

            instance.findShopName(shops)
            
            expect(instance.state.store_name).toBe('shop name2')
            expect(instance.state.store_id).toBe('122')
        })

        it('it should get all items', async()=>{
            const instance = wrapper.instance()
            instance.state.store_id = '12'
            const allitems = [{shop_id: '12', item_name: 'item name', item_price: '60'}, {shop_id: '15', item_name: 'item name3', item_price: '20'}]

            instance.getShopItems(allitems)
            expect(instance.state.items).toStrictEqual([{shop_id: '12', item_name: 'item name', item_price: '60'}])
        })
    })

    describe('Component Mounted Functions Integration', ()=>{

        
        it('should get student balance', async()=>{           
            const instance = wrapper.instance()
            const bal = mockResponseData('100')
            await axios.get.mockImplementationOnce(() =>  Promise.resolve(bal))
            await instance.getStudentBalance()
            
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(instance.state.student_balance).toBe('100')
        })

        it('should get student class code -> shop -> items', async()=>{
            const instance = wrapper.instance()
            
            const users = mockResponseData([{id: '1', class_code: '123'}])
            await axios.get.mockImplementationOnce(() =>  Promise.resolve(users))

            const shops = mockResponseData([{class_code: '123', shop_name: 'shop name', id: '12'}, {class_code: '34', shop_name: 'shop name2', id: '122'}])
            await axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))

            const items = mockResponseData([{shop_id: '12', item_name: 'item name', item_price: '60'}])
            await axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getClassCode()
            
            
            expect(axios.get).toHaveBeenCalledTimes(3)
            expect(instance.state.class_code).toBe('123')
            expect(instance.state.shops).toStrictEqual([{class_code: '123', shop_name: 'shop name', id: '12'}, {class_code: '34', shop_name: 'shop name2', id: '122'}])
            expect(instance.state.store_name).toBe('shop name')
            expect(instance.state.items).toStrictEqual([{shop_id: '12', item_name: 'item name', item_price: '60'}])
        })
        

    })

    describe('Purchasing', ()=>{
        it('should pass purchase validation with enough money', ()=>{
            const instance = wrapper.instance()
            const item = {shop_id: '12', item_name: 'item name', price: '60', description: 'description'}
            instance.state.student_balance = 100
            const result = instance.validatePurchase(item)
            expect(result).toBe(true)

        })

        it('should fail purchase validation with not enough money',()=>{
            const instance = wrapper.instance()
            const item = {shop_id: '12', item_name: 'item name', price: '60', description: 'description'}
            instance.state.student_balance = 40
            const result = instance.validatePurchase(item)
            expect(result).toBe(false)
        })

        it('should buy item for student', async()=>{
            const instance = wrapper.instance()
            const item = {id: '1', shop_id: '12', item_name: 'item name', price: '60', description: 'description'}
            instance.validatePurchase = jest.fn()
            instance.validatePurchase.mockReturnValueOnce(true)
            
            const payload = {item_id: item.id}
            axios.post.mockImplementationOnce(() => Promise.resolve())
            
            const user_id = mockResponseData('2')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user_id))
            
            const payload2 = { amount: item.price, user_id: '2', recipient: false }
            axios.put.mockImplementationOnce(() =>  Promise.resolve())

            const payload3 = {amount: item.price}
            axios.post.mockImplementationOnce(() => Promise.resolve())

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockReturnValueOnce()

            await instance.buyItem(item)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(2)
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//items/boughtitems/', payload)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//students/store/')
            expect(axios.put).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//students/balance/', payload2)
            expect(axios.post).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//transactions/buyFromStore/", payload3)
            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
        })
    })

})


const mockResponseData = jest.fn((data) => {
    if (typeof data === 'string')
    {
        return {
            data: data,
        };
    }
    else
    {
        return {
            data: data,
        };
    }
  });