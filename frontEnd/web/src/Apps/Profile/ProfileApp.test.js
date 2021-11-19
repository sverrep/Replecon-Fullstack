import React from 'react';
import ProfileApp from './ProfileApp.js'
import axios from 'axios'

jest.mock('axios');
let wrapper
let wrapperTeacher
const props = {
    location:{
        state:{
            role: "Student",
            token: 'Token'
        }
    }  
}

const propsTeacher = {
    location:{
        state:{
            role: "Teacher",
            token: 'Token'
        }
    }  
}


describe('Student Profile Tests', ()=>{
    
    beforeEach(() => {
        wrapper = shallow(<ProfileApp.WrappedComponent {...props}/>, { disableLifecycleMethods: true })
        wrapperTeacher = shallow(<ProfileApp.WrappedComponent {...propsTeacher}/>, { disableLifecycleMethods: true })
    });

    describe('Component did mount', ()=>{
        it('should call component did mount properly as a student', async()=>{
            const instance = wrapper.instance()
            
            const user = mockResponseData({id: '1', first_name: 'name', username: 'email@gmail.com'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user))

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockReturnValueOnce()

            instance.getStudentTransactions = jest.fn()
            instance.getStudentTransactions.mockReturnValueOnce()

            instance.getBoughtItems = jest.fn()
            instance.getBoughtItems.mockReturnValueOnce()

            await instance.componentDidMount()

            expect(instance.state.first_name).toBe('name')
            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
            expect(instance.getStudentTransactions).toHaveBeenCalledTimes(1)
            expect(instance.getBoughtItems).toHaveBeenCalledTimes(1)
        })

        it('should call component did mount properly as a teacher', async()=>{
            const instance = wrapperTeacher.instance()
            
            const teacher = mockResponseData({user:{id: '1', first_name: 'teacher name', username: 'email@gmail.com'}, teacher:{id:'12'}})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(teacher))

            instance.getTeacherClasses = jest.fn()
            instance.getTeacherClasses.mockReturnValueOnce()


            await instance.componentDidMount()

            expect(instance.state.first_name).toBe('teacher name')
            expect(instance.getTeacherClasses).toHaveBeenCalledTimes(1)
            
        })
    })

    describe('Profile Classes', ()=>{
        it('should get teacher classes', async()=>{

            const instance = wrapper.instance()
            const classrooms = mockResponseData('classrooms')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(classrooms))

            instance.findTeacherClassrooms = jest.fn()
            instance.findTeacherClassrooms.mockReturnValueOnce()
            await instance.getTeacherClasses()
            expect(instance.findTeacherClassrooms).toHaveBeenCalledTimes(1)
        })

        it('should find teacher classes', ()=>{
            const instance = wrapper.instance()
            const classrooms = [{teacher_id: '2', name: 'name'}, {teacher_id: '3', name: 'name2'}]
            instance.state.teacher_id = '2'
            instance.findTeacherClassrooms(classrooms)
            expect(instance.state.classes).toStrictEqual([{teacher_id: '2', name: 'name'}])
        })

        it('should not find a teacher classe', ()=>{
            const instance = wrapper.instance()
            const classrooms = [{teacher_id: '5', name: 'name'}, {teacher_id: '3', name: 'name2'}]
            instance.state.teacher_id = '2'
            instance.findTeacherClassrooms(classrooms)
            expect(instance.state.classes).toStrictEqual([])
        })
    })

    describe('Student Information', ()=>{
        it('should get student balance', async()=>{
            const instance = wrapper.instance()
            
            const balance = mockResponseData('balance')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(balance))

            await instance.getStudentBalance()
            expect(instance.state.balance).toBe('balance')
        })

        it('should get student transactions', async()=>{
            const instance = wrapper.instance()
            
            const transactions = mockResponseData(['transactions', 'transactions2'])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transactions))

            await instance.getStudentTransactions()
            expect(instance.state.transactions).toStrictEqual(['transactions', 'transactions2'])
        })

        it('should get student bought items', async()=>{
            const instance = wrapper.instance()
            
            const items = mockResponseData(['item', 'item2'])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getBoughtItems()
            expect(instance.state.bought_items).toStrictEqual(['item', 'item2'])
        })
    })

    describe('Class Creation', ()=>{
        it('Should create a class', async()=>{
            const instance = wrapper.instance()
            const classrooms = mockResponseData('classrooms')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(classrooms))
            const classreturn = {class: '1'}
            axios.post.mockImplementationOnce(() =>  Promise.resolve(classreturn))

            instance.state.new_class_name = 'new class'
            instance.state.teacher_id = '2'
            
            instance.makeClassCode = jest.fn()
            instance.makeClassCode.mockReturnValueOnce('ABCDEF')

            await instance.createClass()
            
            expect(instance.state.showCreateClass).toBe(false)
            const payload = {class_name: 'new class', teacher_id: '2', class_code: 'ABCDEF'}
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//classrooms/", payload)
            expect(instance.state.new_class_code).toBe('ABCDEF')
        })

        it('should make a new class code', ()=>{
            const instance = wrapper.instance()

            const classrooms = [{class_code: '123456'}, {class_code: 'BBBBBB'}]
            const result = instance.makeClassCode(classrooms)
            expect(result.length).toBe(6)
        })
    })

    describe('Page Renders', ()=>{
        it('should render the student profile correctly', ()=>{
            expect(wrapper.getElements()).toMatchSnapshot()
        })

        it('should render the teacher profile correctly', ()=>{
            expect(wrapperTeacher.getElements()).toMatchSnapshot()
        })

        it('should render the inventory modal correctly', ()=>{
            const instance = wrapper.instance()
            instance.state.showInven = true
            instance.state.bought_items = [{id: '1', item_name: 'name'}, {id: "2", item_name: 'name2'}]
            expect(instance.renderInventoryModal()).toMatchSnapshot()
        })

        it('should render card that is a positive', ()=>{
            const instance = wrapper.instance()
            const item = {symbol: '+', name: 'name', amount: '100'}
            expect(instance.renderCard(item)).toBe('From name +100$')
        })

        it('should render card that is a negative', ()=>{
            const instance = wrapper.instance()
            const item = {symbol: '-', name: 'name', amount: '100'}
            expect(instance.renderCard(item)).toBe('To name -100$')
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