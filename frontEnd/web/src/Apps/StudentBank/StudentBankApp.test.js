import React from 'react';
import StudentBankApp from './StudentBankApp.js'
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

describe('Student Bank Tests', ()=>{
    
    beforeEach(() => {
        wrapper = shallow(<StudentBankApp.WrappedComponent {...props}/>, { disableLifecycleMethods: true })
    });

    describe('Component Did Mount', ()=>{
        it('should call correct functions in component did mount', async()=>{
            const instance = wrapper.instance()
            instance.getClassStudents = jest.fn()
            instance.getClassStudents.mockReturnValueOnce()
    
            instance.getBanks = jest.fn()
            instance.getBanks.mockReturnValueOnce()
    
            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockReturnValueOnce()
    
            await instance.componentDidMount()
    
            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.getBanks).toHaveBeenCalledTimes(1)
            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
        })
    })

    describe('Student Balance', ()=>{
        it('should retrieve the proper student balance', async()=>{
            const instance = wrapper.instance()
            const bal = mockResponseData('100')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(bal))
            await instance.getStudentBalance()
            
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(instance.state.student_balance).toBe('100')
        })

        it('should not retrieve the student balance', async()=>{
            const instance = wrapper.instance()
            axios.get.mockImplementationOnce(() =>  Promise.reject('Token is not authenticated'))
            await instance.getStudentBalance()
            
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(instance.state.message).toBe('Token is not authenticated')
        })
    })

    describe('Class Students', ()=>{
        it('should get student classroom', async()=>{
            const instance = wrapper.instance()

            instance.getBanks = jest.fn()
            instance.getBanks.mockReturnValueOnce()
    
            instance.getClassroomDetails = jest.fn()
            instance.getClassroomDetails.mockReturnValueOnce()
    
            instance.getStudentSavings = jest.fn()
            instance.getStudentSavings.mockReturnValueOnce()
    
            const classroom = mockResponseData([{class_code: '2'}, {class_code: '2'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(classroom))
    
            const user = mockResponseData({class_code: '2', name: 'name', balance: '123'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user))
    
            await instance.getClassStudents()
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(instance.state.classroom).toBe('2')
            expect(instance.state.loggedin_student).toStrictEqual({class_code: '2', name: 'name', balance: '123'})
        })

        it('should get classroom details', async()=>{
            const instance = wrapper.instance()
            const classroom = mockResponseData([{classroom: 'classroom of 1'}, {classroom: 'classroom of 2'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(classroom))

            instance.findClassroom = jest.fn()
            instance.findClassroom.mockReturnValueOnce()

            await instance.getClassroomDetails()

            expect(instance.findClassroom).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledTimes(1)
        })

        it('should find a classroom', ()=>{
            const instance = wrapper.instance()
            instance.state.classroom = '123'
            const classrooms = [{class_code: '123', class_name: 'best classroom'}, {class_code: '452', class_name: 'worst classroom'}]
            instance.findClassroom(classrooms)
            expect(instance.state.class_name).toBe('best classroom')
        })

        it('should not find a classroom', ()=>{
            const instance = wrapper.instance()
            instance.state.classroom = '555'
            const classrooms = [{class_code: '123', class_name: 'best classroom'}, {class_code: '452', class_name: 'worst classroom'}]
            instance.findClassroom(classrooms)
            expect(instance.state.class_name).toBe('')
        })
        

    })

    describe('Class Banks', ()=>{
        it('should get banks', async()=>{
            const instance = wrapper.instance()
            
            const banks = mockResponseData('banks details')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(banks))
            
            instance.getBankDetails = jest.fn()
            instance.getBankDetails.mockReturnValueOnce()
            await instance.getBanks('123')
            expect(instance.state.banks).toBe('banks details')
            expect(instance.getBankDetails).toHaveBeenCalledTimes(1)
        })

        it('should find the bank details', ()=>{
            const instance = wrapper.instance()
            const banks = [{class_code: '123', interest_rate: '12', payout_rate: '1'}, {class_code: '231', interest_rate: '15', payout_rate: '2'}]
            const class_code = '123'
            instance.getBankDetails(banks, class_code)
            expect(instance.state.interest_rate).toBe('12')
            expect(instance.state.payout_rate).toBe('1')
        })

        it('should not find a bank detail', ()=>{
            const instance = wrapper.instance()
            const banks = [{class_code: '123', interest_rate: '12', payout_rate: '1'}, {class_code: '231', interest_rate: '15', payout_rate: '2'}]
            const class_code = '555'
            instance.getBankDetails(banks, class_code)
            expect(instance.state.interest_rate).toBe('')
            expect(instance.state.payout_rate).toBe('')
        })
    })

    describe('Student Savings', ()=>{
        it('should find the student savings get', async()=>{
            const instance = wrapper.instance()
            instance.state.loggedin_student = {id: '2'}
            
            const transactions = mockResponseData([
            {transaction_id: '1', active: true, set_interest_rate: '10'}, 
            {transaction_id: '2', active: true, set_interest_rate: '15'}
            ])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transactions))

            const firsttrans = mockResponseData({amount: '100', sender_id: '2', id: '213'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(firsttrans))

            const firstpayout = mockResponseData('12/12/2021')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(firstpayout))

            const secondtrans = mockResponseData({amount: '100', sender_id: '1', id: '215'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(secondtrans))

            await instance.getStudentSavings()
            expect(instance.state.savings.length).toStrictEqual(1)
            expect(axios.get).toHaveBeenCalledTimes(4)
            
            const expected_result = [{
                "active": true,
                 "final_amount": 110, 
                 "id": 0, "initial_amount": 100, 
                 "interest_rate": 10, 
                 "payout_date": NaN, 
                 "transaction_id": "213"}]

            expect(instance.state.savings).toStrictEqual(expected_result)
        })

        it('should not find any savings get', async()=>{
            const instance = wrapper.instance()
            instance.state.loggedin_student = {id: '2'}
            
            const transactions = mockResponseData([
            {transaction_id: '1', active: true, set_interest_rate: '10'}, 
            {transaction_id: '2', active: true, set_interest_rate: '15'}
            ])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transactions))

            const firsttrans = mockResponseData({amount: '100', sender_id: '3', id: '213'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(firsttrans))
            const secondtrans = mockResponseData({amount: '100', sender_id: '1', id: '215'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(secondtrans))

            await instance.getStudentSavings()
            expect(instance.state.savings.length).toStrictEqual(0)
            expect(axios.get).toHaveBeenCalledTimes(3)
            expect(instance.state.savings).toStrictEqual([])
        })

        it('should set the student savings', async()=>{
            const instance = wrapper.instance()
            instance.state.value = '100'
            instance.state.classroom = '123'

            const payload = {"amount": '100', "done": false}
            const banksavings = mockResponseData({id: '12'})
            axios.post.mockImplementationOnce(() => Promise.resolve(banksavings))

            const payload2 = {"class_code": '123', "transaction_id": '12'}
            
            axios.post.mockImplementationOnce(() => Promise.resolve())

            const bankid = mockResponseData('123')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(bankid))

            const payload3 = { amount: '100', user_id: '123', recipient: false }
            axios.put.mockImplementationOnce(() =>  Promise.resolve())

            instance.getStudentSavings = jest.fn()
            instance.getStudentSavings.mockImplementationOnce()

            instance.validateSavings = jest.fn()
            instance.validateSavings.mockReturnValueOnce(true)

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockImplementationOnce()



            await instance.setStudentSavings()
            expect(instance.state.show).toBe(false)
            expect(axios.post).toHaveBeenCalledTimes(2)
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(instance.getStudentSavings).toHaveBeenCalledTimes(1)
            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
        })

        it('should claim the student savings', async()=>{
            const instance = wrapper.instance()
            const item ={final_amound: '100', transaction_id: '111'}
            

            
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.put.mockImplementationOnce(() => Promise.resolve())

            const bankid = mockResponseData('123')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(bankid))
            axios.put.mockImplementationOnce(() => Promise.resolve())

            instance.getStudentSavings = jest.fn()
            instance.getStudentSavings.mockImplementationOnce()

            instance.validateClaim = jest.fn()
            instance.validateClaim.mockReturnValueOnce(true)

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockImplementationOnce()
            
            await instance.claimSavings(item)
    
            expect(axios.put).toHaveBeenCalledTimes(2)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(instance.getStudentSavings).toHaveBeenCalledTimes(1)
            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
        })
    })

    describe('Validation', ()=>{
        it("should pass claim validation", ()=>{
            const instance = wrapper.instance()
            const item = {payout_date: 0}
            const result = instance.validateClaim(item)
            expect(result).toBe(true)
            expect(instance.state.message).toBe('Money claimed successfully')
            expect(instance.state.showAlert).toBe(true)
        })

        it('should fail claim validation', ()=>{
            const instance = wrapper.instance()
            const item = {payout_date: 2}
            const result = instance.validateClaim(item)
            expect(result).toBe(false)
            expect(instance.state.message).toBe('That money is not ready to be claimed')
            expect(instance.state.showAlert).toBe(true)
        })

        it('should pass validate savings', ()=>{
            const instance = wrapper.instance()
            instance.state.value = '123'
            instance.state.student_balance = '200'
            const result = instance.validateSavings()

            expect(result).toBe(true)
            expect(instance.state.message).toBe('Money saved successfully')
        })

        it('should fail validate savings', ()=>{
            const instance = wrapper.instance()
            instance.state.value = '123'
            instance.state.student_balance = '100'
            const result = instance.validateSavings()

            expect(result).toBe(false)
            expect(instance.state.message).toBe('You dont have that amount of money')
        })
    })

    describe('Renders', ()=>{
        it('should render page properly', ()=>{
            expect(wrapper.getElements()).toMatchSnapshot()
        })

        it('should render card properly', ()=>{
            const instance = wrapper.instance()
            const item = {intial_amaount: '123', final_amount: '200', payout_date: '3', active: true}
            expect(instance.renderSavings(item, 1)).toMatchSnapshot()
        })

        it('should render alert properly', ()=>{
            const instance = wrapper.instance()
            expect(instance.renderAlert('danger', 'message')).toMatchSnapshot()
        })
    })
})


const mockResponseData = jest.fn((data) => {
    if (typeof data === 'string')
    {
        return {
            data,
        };
    }
    else
    {
        return {
            data,
        };
    }
  });