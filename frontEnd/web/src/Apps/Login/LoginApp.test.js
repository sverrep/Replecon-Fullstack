import React from 'react';
import ReactDOM from 'react-dom';
import LoginApp from './LoginApp.js'
import axios from 'axios'
jest.mock('axios', () => {
    return {
      post: jest.fn(() => Promise.resolve({ data: {} })),
    };
  });

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

it('should call set student_profile_redirect', async () => {
    const wrapper = shallow(<LoginApp />)
    wrapper.instance().validateData = jest.fn()
    wrapper.instance().validateData.mockReturnValueOnce(true)
    wrapper.instance().state.email = "student@mail.com"
    wrapper.instance().state.password = "12345"
    wrapper.instance().state.token = ""
    const payload = {
        username: wrapper.instance().state.email,
        password: wrapper.instance().state.password
    }
    const users = mockResponseData(true, ['John Doe', 'Charles']);
    axios.post.mockResolvedValue(() => {
        return Promise.resolve(users);
      });

    const result = await wrapper.instance().handleLogin()
    console.log(result)
    expect(wrapper.instance().validateData).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//auth/login/', payload)
    expect(result).toBe(users)


});



const mockResponseData = jest.fn((success, payload) => {
    return {
      data: {
        result: {
          success,
          payload,
        },
      },
    };
  });