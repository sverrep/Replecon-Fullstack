import React from 'react';
import StudentClassApp from './StudentClassApp.js'
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

describe('Student Class Tests', ()=>{
    
    beforeEach(() => {
        wrapper = shallow(<StudentClassApp.WrappedComponent {...props}/>, { disableLifecycleMethods: true })
    });

    describe('Component did mount', ()=>{
        it('should call the correct functions and retrieve data', async()=>{
            const instance = wrapper.instance()
            
            const user = mockResponseData({id: '1', first_name: 'name'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user))

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockReturnValueOnce()

            instance.getClassStudents = jest.fn()
            instance.getClassStudents.mockReturnValueOnce()

            await instance.componentDidMount()
            expect(instance.state.current_user_id).toBe('1')
            expect(instance.state.current_user_name).toBe('name')

            expect(instance.getStudentBalance).toHaveBeenCalledTimes(1)
            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)

        })
    })

    describe('Student Balance', ()=>{
        it('should retrieve student balance', async()=>{
            const instance = wrapper.instance()
            const user = mockResponseData('100')
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user))

            await instance.getStudentBalance()
            expect(instance.state.balance).toBe('100')

        })  
    })

    describe('Student Class', ()=>{
        it('should get class code and students', async()=>{
            const instance = wrapper.instance()
            const students = mockResponseData([{class_code: '123', name: 'name'}, {class_code: '123', name: 'name'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))

            instance.getClassroomDetails = jest.fn()
            instance.getClassroomDetails.mockReturnValueOnce()

            await instance.getClassStudents()
            expect(instance.state.classroom).toBe('123')
            expect(instance.getClassroomDetails).toHaveBeenCalledTimes(1)
        })

        it('should get classroom details', async()=>{
            const instance = wrapper.instance()
            const classrooms = mockResponseData([{class_code: '123', class_name: 'class name'}, {class_code: '444', class_name: 'class name2'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(classrooms))

            instance.findClassroom = jest.fn()
            instance.findClassroom.mockReturnValueOnce()

            await instance.getClassroomDetails()
            expect(instance.findClassroom).toHaveBeenCalledTimes(1)
        })

        it('should find the classroom', async()=>{
            const instance = wrapper.instance()
            instance.state.classroom = '123'

            const classrooms = [{class_code: '123', class_name: 'class name', teacher_id: '2'}, {class_code: '444', class_name: 'class name2', teacher_id: '3'}]
            const teachers = mockResponseData([{id: '2', last_name: 'last name'}, {id: '23', last_name: 'last name2'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(teachers))
            
            await instance.findClassroom(classrooms)

            expect(instance.state.teacher).toBe('last name')
            expect(axios.get).toHaveBeenCalledTimes(1)
        })

        it('should not find a classroom', async()=>{
            const instance = wrapper.instance()
            instance.state.classroom = '123'

            const classrooms = [{class_code: '123', class_name: 'class name', teacher_id: '2'}, {class_code: '444', class_name: 'class name2', teacher_id: '3'}]
            const teachers = mockResponseData([{id: '234', last_name: 'last name'}, {id: '23', last_name: 'last name2'}])
            axios.get.mockImplementationOnce(() =>  Promise.resolve(teachers))
            
            await instance.findClassroom(classrooms)
            expect(instance.state.teacher).toBe('')
            expect(axios.get).toHaveBeenCalledTimes(1)
        })
        
    })

    describe('Student Transactions', ()=>{
        it('should pass validate transfer', async ()=>{
            const instance = wrapper.instance()
            instance.state.value = '100'
            instance.state.balance = '200'
            instance.getStudentBalance = jest.fn()
            await instance.validateTransfer()
            expect(instance.state.message).toBe('Money Sent')
        })

        it('should fail validate transfer', async ()=>{
            const instance = wrapper.instance()
            instance.state.value = '300'
            instance.state.balance = '200'
            instance.getStudentBalance = jest.fn()
            await instance.validateTransfer()
            expect(instance.state.message).toBe('You dont have that amount of money')
        })
        //Put is just not registering for some reason wcyd
        it('should create transaction', async()=>{
            const instance = wrapper.instance()
            instance.state.students = [{id:'1'}, {id:'2'}]
            instance.state.value = '100'
            instance.state.clicked = {id: '1'}
            instance.validateTransfer = jest.fn()
            instance.validateTransfer.mockReturnValueOnce(true)

            const teachers = mockResponseData({id: '234'})
            axios.get.mockImplementationOnce(() =>  Promise.resolve(teachers))
            axios.put.mockImplementationOnce(() =>  Promise.resolve())
            axios.post.mockImplementationOnce(() =>  Promise.resolve())

            instance.getStudentBalance = jest.fn()
            instance.getStudentBalance.mockReturnValueOnce()

            await instance.createTransaction()
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//students/balance/", {"amount": "100", "recipient": false, "user_id": "1"})
            expect(axios.put).toHaveBeenCalledTimes(1)
        })
    })
    
    describe('Studend Class Page Renders and alerts', ()=>{
        it('should show alert', ()=>{
            const instance = wrapper.instance()
            const item = {id: '2', name:'name'}
            instance.state.current_user_id = '1'
            instance.alertClicked(item)
            expect(instance.state.active).toBe(true)
        })

        it('should not show alert', ()=>{
            const instance = wrapper.instance()
            const item = {id: '1', name:'name'}
            instance.state.current_user_id = '1'
            instance.alertClicked(item)
            expect(instance.state.active).toBe(false)
        })

        it('should render page correctly', ()=>{
            expect(wrapper.getElements()).toMatchSnapshot()
        })

        it('should render modal correctly', ()=>{
            const instance = wrapper.instance()
            instance.state.active = true
            expect(instance.renderModal()).toMatchSnapshot()
        })

        it('should render card correctly', ()=>{
            const instance = wrapper.instance()
            const item = {name:'name'}
            expect(instance.renderCards(item)).toMatchSnapshot()
        })

        it('should render alerts correctly', ()=>{
            const instance = wrapper.instance()
            expect(instance.renderAlert('danger', 'message')).toMatchSnapshot()
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