import React from 'react';
import ReactDOM, { render } from 'react-dom';
import LoginApp from './LoginApp.js'
import axios from 'axios'
jest.mock('axios');

describe('LoginApp Testing', () => {
    describe('validateData testing', () => {
        it('should fail validateData due to email', () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().state.email = "student"
            wrapper.instance().state.password = "12345"
            const condition = wrapper.instance().validateData()
            expect(wrapper.instance().state.error).toBe("Email is invalid")
            expect(condition).toBe(undefined)
        });
        
        it('should fail validateData due to password', () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().state.email = "student@mail.com"
            wrapper.instance().state.password = ""
            const condition = wrapper.instance().validateData()
            expect(wrapper.instance().state.error).toBe("Password needs to be longer")
            expect(condition).toBe(undefined)
        });
        
        it('should pass validateData', () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().state.email = "student@mail.com"
            wrapper.instance().state.password = "12345"
            const condition = wrapper.instance().validateData()
            expect(wrapper.instance().state.error).toBe("")
            expect(condition).toBe(true)
        });
    })

    describe('handleChange testing', () => {
        it('should change email', () => {
            const wrapper = shallow(<LoginApp />)
            const event = {
                preventDefault() {},
                target: {id: "email", value: "teacher@mail.com"}
            }
            wrapper.instance().handleChange(event)
            expect(wrapper.instance().state.email).toBe("teacher@mail.com")
        });
        
        it('should change password', () => {
            const wrapper = shallow(<LoginApp />)
            const event = {
                preventDefault() {},
                target: {id: "password", value: "54321"}
            }
            wrapper.instance().handleChange(event)
            expect(wrapper.instance().state.password).toBe("54321")
        });
        
        it('should change nothing', () => {
            const wrapper = shallow(<LoginApp />)
            const event = {
                preventDefault() {},
                target: {id: "", value: "value"}
            }
            wrapper.instance().state.email = "student@mail.com"
            wrapper.instance().state.password = "12345"
            wrapper.instance().handleChange(event)
            expect(wrapper.instance().state.email).toBe("student@mail.com")
            expect(wrapper.instance().state.password).toBe("12345")
        });
    })

    describe('handeLogin testing', () => {
        it('should call set student_profile_redirect', async () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().validateData = jest.fn()
            wrapper.instance().validateData.mockReturnValueOnce(true)
            wrapper.instance().state.email = "student@mail.com"
            wrapper.instance().state.password = "12345"
            const payload = {
                username: wrapper.instance().state.email,
                password: wrapper.instance().state.password
            }
            const users = mockResponseData("token");
            const cond = mockResponseData(false)
        
            axios.post.mockImplementationOnce(() => Promise.resolve(users))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(cond))
        
            await wrapper.instance().handleLogin()
        
            expect(wrapper.instance().validateData).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//auth/login/', payload)
        
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//teachers/isTeacher/')
            expect(wrapper.instance().state.redirect_student_profile).toBe(true)
        });

        it('should call set teacher_profile_redirect', async () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().validateData = jest.fn()
            wrapper.instance().validateData.mockReturnValueOnce(true)
            wrapper.instance().state.email = "teacher@mail.com"
            wrapper.instance().state.password = "12345"
            const payload = {
                username: wrapper.instance().state.email,
                password: wrapper.instance().state.password
            }
            const users = mockResponseData("token");
            const cond = mockResponseData(true)
        
            axios.post.mockImplementationOnce(() => Promise.resolve(users))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(cond))
        
            await wrapper.instance().handleLogin()
        
            expect(wrapper.instance().validateData).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//auth/login/', payload)
        
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//teachers/isTeacher/')
            expect(wrapper.instance().state.redirect_teacher_profile).toBe(true)
        })

        it('should not find user', async () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().validateData = jest.fn()
            wrapper.instance().validateData.mockReturnValueOnce(true)
            wrapper.instance().state.email = "incorrect@mail.com"
            wrapper.instance().state.password = "wrongpass"
            const payload = {
                username: wrapper.instance().state.email,
                password: wrapper.instance().state.password
            }
        
            axios.post.mockImplementationOnce(() => Promise.reject("User Not Found"))
        
            await wrapper.instance().handleLogin()
            expect(wrapper.instance().validateData).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//auth/login/', payload)
            expect(wrapper.instance().state.error).toBe('User Not Found')
        })

        it('should not pass validateData condition', async () => {
            const wrapper = shallow(<LoginApp />)
            wrapper.instance().validateData = jest.fn()
            wrapper.instance().validateData.mockReturnValueOnce(false)
            wrapper.instance().state.email = "incorrect"
            wrapper.instance().state.password = "weakpass"
            const payload = {
                username: wrapper.instance().state.email,
                password: wrapper.instance().state.password
            }
        
            axios.post.mockImplementationOnce(() => Promise.reject("User Not Found"))
        
            await wrapper.instance().handleLogin()
            expect(wrapper.instance().validateData).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(0)
        })
        
    })

    describe('component render testing', () => {
        it('Login page renders correctly', async () => {
            const wrapper = shallow(<LoginApp/>)
            expect(wrapper.getElements()).toMatchSnapshot();
        })
        
    })
    
})


const mockResponseData = jest.fn((data) => {
    if (typeof data === 'string')
    {
        return {
            data: {token: data},
        };
    }
    else
    {
        return {
            data: data,
        };
    }
  });