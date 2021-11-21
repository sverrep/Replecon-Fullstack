import React from 'react';
import SignUpApp from './SignUpApp.js'
import axios from 'axios'

jest.mock('axios');

const props = {
    location:{
        state:{
            role: "Student"
        }
    }  
}

const props2 = {
    location:{
        state:{
            role: "Teacher"
        }
    }  
}

describe('Sign Up Tests', ()=>{
    
    describe("Render Tests", ()=>{
        it('Teacher Render', ()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props2} />)
            expect(wrapper.getElements()).toMatchSnapshot();
        })

        it('Student Render', ()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            expect(wrapper.getElements()).toMatchSnapshot();
        })
    })

    describe('User Fields Test', ()=>{
        it('Teacher Unique Field ', ()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props2} />)
            const result = wrapper.instance().setUpUniqueFields()
            expect(result).toMatchSnapshot()
        })

        it('Student Unique Field ', ()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            const result = wrapper.instance().setUpUniqueFields()
            expect(result).toMatchSnapshot()
        })

        it('Common Field ', ()=>{
            let wrapperstudent = shallow(<SignUpApp.WrappedComponent {...props} />)
            const result = wrapperstudent.instance().setUpCommonFields()

            let wrapperteacher = shallow(<SignUpApp.WrappedComponent {...props2} />)
            const result2 = wrapperteacher.instance().setUpCommonFields()
            expect(result2).toMatchSnapshot()
        })
    })

    describe('Password Tests', ()=>{
        it('should fail password complexity', ()=>{
            
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            const result = wrapper.instance().vaildateComplexity('12345')
            expect(result).toBe(false)
        });

        it('should validate password complexity', ()=>{

            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            const result = wrapper.instance().vaildateComplexity('!Student12')
            expect(result).toBe(true)
        });

        it('should validate strong password ', ()=>{

            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            const result = wrapper.instance().validateStrongPassword('todaywasagoodday142')
            expect(result).toBe(true)
        });

        it('should fail strong password ', ()=>{

            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            const result = wrapper.instance().validateStrongPassword('1234')
            expect(result).toBe(false)
        });
    })

    describe('User Validation', ()=>{
        it('should fail email validation', ()=>{
    
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            wrapper.instance().state.email = "student"
            wrapper.instance().validateData()
            expect(wrapper.instance().state.error).toBe("Email is invalid")
        })

        it('should fail class code length validation', ()=>{
    
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            wrapper.instance().state.email = "student@gmail.com"
            wrapper.instance().state.password = "!sdfsdfA12"
            wrapper.instance().state.name = "name"
            wrapper.instance().state.class_code = "12345"
            wrapper.instance().validateData()
            expect(wrapper.instance().state.error).toBe("Class Code needs to be 6 characters long")
        })

        it('should pass complete user validation', async()=>{
    
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            wrapper.instance().state.email = "student@gmail.com"
            wrapper.instance().state.password = "!sdfsdfA12"
            wrapper.instance().state.name = "name"
            wrapper.instance().state.class_code = "123456"
            wrapper.instance().checkClassCode = jest.fn()
            wrapper.instance().checkClassCode.mockReturnValueOnce(true)
            await wrapper.instance().validateData()
            expect(wrapper.instance().state.error).toBe("")
            
        })
        
    })

    describe('Class code API Calls', ()=>{
        it('should find class room', async()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)

            const classes = mockResponseData([
                {
                  "id":"1",
                  "class_name":"started",
                  "teacher_id":"Milestone",
                  "class_code":'123456'
                },
                {
                    "id":"1",
                    "class_name":"started",
                    "teacher_id":"Milestone",
                    "class_code":'1ASDD6'
                }])
                await axios.get.mockImplementationOnce(() =>  Promise.resolve(classes))
                const result = await wrapper.instance().checkClassCode('123456')
                expect(axios.get).toHaveBeenCalledTimes(1)
                expect(result).toBe(true)
                expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//classrooms/')
            
        })

        it('should not find classroom', async()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)

            const classes = mockResponseData([
                {
                  "id":"1",
                  "class_name":"started",
                  "teacher_id":"Milestone",
                  "class_code":'123457'
                },
                {
                    "id":"1",
                    "class_name":"started",
                    "teacher_id":"Milestone",
                    "class_code":'1ASDD6'
                }])
                await axios.get.mockImplementationOnce(() =>  Promise.resolve(classes))
                const result = await wrapper.instance().checkClassCode('123456')
                expect(result).toBe(false)
                expect(axios.get).toHaveBeenCalledTimes(1)
                expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//classrooms/')
        })
    })
    
    describe('SignUp API Calls', ()=>{
        it('should create student account and redirect to profile page', async()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props} />)
            wrapper.instance().validateData = jest.fn()
            wrapper.instance().validateData.mockReturnValueOnce(true)
            wrapper.instance().state.email = 'student@gmail.com'
            wrapper.instance().state.password = 'password'
            wrapper.instance().state.name = 'name'
            wrapper.instance().state.class_code = '123456'

            const payload = {
                username: 'student@gmail.com', 
                password: 'password', 
                first_name: 'name', 
                email: 'student@gmail.com'
            }

            const payload2 = {
                class_code:'123456'
            }

            const user = mockResponseData('Token')
            const user2 = mockResponseData(true)
            
            axios.post.mockImplementationOnce(() => Promise.resolve(user))
            axios.post.mockImplementationOnce(() => Promise.resolve(user2))

            await wrapper.instance().handleSignup()
            
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//auth/register/', payload)
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//students/create/', payload2)
            expect(wrapper.instance().state.redirect_profile).toBe(true)
            expect(axios.post).toHaveBeenCalledTimes(2)
        })

        it('should create teacher account and redirect to profile page', async()=>{
            let wrapper = shallow(<SignUpApp.WrappedComponent {...props2} />)
            wrapper.instance().validateData = jest.fn()
            wrapper.instance().validateData.mockReturnValueOnce(true)
            wrapper.instance().state.email = 'teacher@gmail.com'
            wrapper.instance().state.password = 'password'
            wrapper.instance().state.first_name = 'name'
            wrapper.instance().state.last_name = 'last'
            wrapper.instance().state.class_code = '123456'

            const payload = {
                username: 'teacher@gmail.com', 
                password: 'password', 
                first_name: 'name', 
                email: 'teacher@gmail.com'
            }

            const payload2 = {
                last_name:'last'
            }

            const user = mockResponseData('Token')
            const user2 = mockResponseData(true)
            
            axios.post.mockImplementationOnce(() => Promise.resolve(user))
            axios.post.mockImplementationOnce(() => Promise.resolve(user2))

            await wrapper.instance().handleSignup()
            
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//auth/register/', payload)
            expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//teachers/create/', payload2)
            expect(wrapper.instance().state.redirect_profile).toBe(true)
            expect(axios.post).toHaveBeenCalledTimes(2)
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