import React from 'react';
import ReactDOM, { render } from 'react-dom';
import TeacherBank from './TeacherBank.js'
import axios from 'axios'
jest.mock('axios');
let wrapper

describe('TeacherBank Testing', () => {
    beforeEach(() => {
        const props = {
            location: {
                state: {
                    class: {
                        class_code: "classc",
                        class_name: "classname"
                    },
                    teacher_id: "teacherid",
                    token: "token",
                }
            }
        }
        wrapper = shallow(<TeacherBank.WrappedComponent {...props} />, { disableLifecycleMethods: true })
    })
    describe('componentMount testing', () => {
        it('should call the right functions', async () => {
            const instance = wrapper.instance()

            instance.getClassStudents = jest.fn()
            instance.getBanks = jest.fn()

            await instance.componentDidMount()

            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.getBanks).toHaveBeenCalledTimes(1)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const banks = mockBankData()
            const transactioninterestrates = mockTransactionInterestRates()
            const transaction = mockTransactionData()
            const transaction2 = mockTransactionData2()
            const user = mockUserData()
            const user2 = mockUserData2()
            const payout_date = {data: "15/12/2021"}
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(banks))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transactioninterestrates))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transaction))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(payout_date))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transaction2))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user2))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(payout_date))

            await instance.componentDidMount()
            expect(axios.get).toHaveBeenCalledTimes(9)
            expect(instance.state.banks).toBe(banks.data)
            expect(instance.state.classHasBank).toBe(true)
            expect(instance.state.bank_id).toBe("bankid")
            expect(instance.state.interest_rate).toBe("intrate")
            expect(instance.state.payout_rate).toBe("payrate")
            expect(instance.state.student_savings).toHaveLength(2)
            
        });   
    })
    describe('getClassStudents testing', () => {
        it('should reject axios call', async () => {
            const instance = wrapper.instance()

            axios.get.mockImplementationOnce(() => Promise.reject("Token not authenticated"))
            await instance.getClassStudents()
            expect(instance.state.error).toBe("Token not authenticated")
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//students/')

        });

        it('should pass axios call and call getCurrentClassStudents', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))
            instance.getCurrentClassStudents = jest.fn()

            await instance.getClassStudents()
            expect(instance.getCurrentClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.getCurrentClassStudents).toHaveBeenCalledWith(students.data)
        }); 

        it('should pass axios call and set students state', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))

            await instance.getClassStudents()
            expect(instance.state.students).toEqual(students.data)
        }); 
    })
    describe('getCurrentClassStudents testing', () => {
        it('should find no students', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            students.data[0].class_code = "classa"
            students.data[1].class_code = "classb"
            instance.getCurrentClassStudents(students.data)
            expect(instance.state.students).toEqual([])

        });
        it('should find 1 student and write it to state', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            students.data[1].class_code = "classb"
            instance.getCurrentClassStudents(students.data)
            expect(instance.state.students).toHaveLength(1)
            expect(instance.state.students[0]).toEqual(students.data[0])
        });
        it('should find both student and write it to state', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            instance.getCurrentClassStudents(students.data)
            expect(instance.state.students).toHaveLength(2)
            expect(instance.state.students).toEqual(students.data)
        });
    })
    describe('getBanks testing', () => {
        it('should set state and call checkForBank', async() => {
            const instance = wrapper.instance()
            instance.checkForBank = jest.fn()
            const banks = mockBankData()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(banks))

            await instance.getBanks()
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//banks/')
            expect(instance.state.banks).toHaveLength(2)
            expect(instance.state.banks).toEqual(banks.data)
            expect(instance.checkForBank).toHaveBeenCalledTimes(1)

        });
    })
    describe('checkForBank testing', () => {
        it('should not find any banks', async() => {
            const instance = wrapper.instance()
            instance.getStudentSavings = jest.fn()
            const banks = mockBankData()
            banks.data[0].class_code = "classa"

            await instance.checkForBank(banks.data)
            expect(instance.state.classHasBank).toBe(false)
            expect(instance.state.bank_id).toBe("")
            expect(instance.state.interest_rate).toBe("")
            expect(instance.state.payout_rate).toBe("")
            expect(instance.getStudentSavings).toHaveBeenCalledTimes(1)
        });
        it('should set state and call getStudentSavings', async() => {
            const instance = wrapper.instance()
            instance.getStudentSavings = jest.fn()
            const banks = mockBankData()

            await instance.checkForBank(banks.data)
            expect(instance.state.classHasBank).toBe(true)
            expect(instance.state.bank_id).toBe("bankid")
            expect(instance.state.interest_rate).toBe("intrate")
            expect(instance.state.payout_rate).toBe("payrate")
            expect(instance.getStudentSavings).toHaveBeenCalledTimes(1)
        });
    })
    describe('isStudentInClass testing', () => {
        it('should return false', async() => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            expect(instance.isStudentInClass(students.data[0].name)).toBe(false)
            
        });
        it('should return true', async() => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            instance.state.students = students.data
            expect(instance.isStudentInClass(students.data[0].name)).toBe(true)
            
        });
    })
    describe('renderStudentSavings testing', () => {
        it('should not display not selected students', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]

            expect(instance.renderStudentSavings(student)).toMatchSnapshot();

        });

        it('should display selected students items', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]
            student.active = true
            student.initial_amount = 10
            student.interest_rate = 5
            student.final_amount = 10.5
            student.payout_date = 5

            expect(instance.renderStudentSavings(student)).toMatchSnapshot();
        });


    })
    describe('getStudentSavings testing', () => {

        it('should pass and set correct states', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            instance.state.students = students.data
            const transactioninterestrates = mockTransactionInterestRates()
            const transaction = mockTransactionData()
            const transaction2 = mockTransactionData2()
            const user = mockUserData()
            const user2 = mockUserData2()
            const payout_date = {data: "15/12/2021"}
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transactioninterestrates))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transaction))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(payout_date))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(transaction2))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(user2))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(payout_date))

            await instance.getStudentSavings()

            expect(axios.get).toHaveBeenCalledTimes(7)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//transactioninterestrates/')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//transactions/1')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//users/studentid/')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//transactioninterestrates/payoutdate/1')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//transactions/2')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//users/2studentid/')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//transactioninterestrates/payoutdate/2')
            expect(instance.state.student_savings).toHaveLength(2)
        });   
    })
    describe('hasBank testing', () => {
        it('should render hasBank view', () => {
            const instance = wrapper.instance()

            instance.state.class_name = "Test"
            instance.state.interest_rate = "5"
            instance.state.payout_rate = "1"

            expect(instance.hasBank()).toMatchSnapshot();
        });
    })
    describe('hasNoBank testing', () => {
        it('should render hasNoBank view', () => {
            const instance = wrapper.instance()

            expect(instance.hasNoBank()).toMatchSnapshot();
        });
    })
    describe('renderBankView testing', () => {
        it('should call hasBank view', () => {
            const instance = wrapper.instance()
            instance.hasBank = jest.fn()
            instance.hasNoBank = jest.fn()
            instance.state.classHasBank = true
            instance.renderBankView()
            expect(instance.hasBank).toHaveBeenCalledTimes(1)
            expect(instance.hasNoBank).toHaveBeenCalledTimes(0)
            
        });
        it('should call hasNoBank view', () => {
            const instance = wrapper.instance()
            instance.hasBank = jest.fn()
            instance.hasNoBank = jest.fn()

            instance.renderBankView()
            expect(instance.hasBank).toHaveBeenCalledTimes(0)
            expect(instance.hasNoBank).toHaveBeenCalledTimes(1)
        });
    })
    describe('createNewBank testing', () => {
        it('should not pass validateBank', () => {
            const instance = wrapper.instance()
            instance.validateBank = jest.fn()
            instance.validateBank.mockReturnValueOnce(false)
            instance.createNewBank()
            expect(axios.post).toHaveBeenCalledTimes(0)
            
        });
        it('should pass', async () => {
            const instance = wrapper.instance()
            instance.state.interest_rate = 10
            instance.state.payout_rate = 1
            instance.state.bankModalShow = true
            instance.getBanks = jest.fn()
            axios.post.mockImplementationOnce(() =>  Promise.resolve())

            await instance.createNewBank()
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith(
                'https://mythical-mason-324813.ey.r.appspot.com//banks/', 
                {
                    "class_code": "classc", 
                    "interest_rate": 10, 
                    "payout_rate": 1
                }
            )
            expect(instance.state.bankModalShow).toBe(false)
            expect(instance.getBanks).toHaveBeenCalledTimes(1)
        });
    })
    describe('updateBankRates testing', () => {
        it('should not pass validateBank', () => {
            const instance = wrapper.instance()
            instance.validateBank = jest.fn()
            instance.validateBank.mockReturnValueOnce(false)
            instance.updateBankRates()
            expect(axios.post).toHaveBeenCalledTimes(0)
            
        });
        it('should pass', async () => {
            const instance = wrapper.instance()
            instance.state.interest_rate = 11
            instance.state.payout_rate = 2
            instance.state.updateBankModalShow = true
            instance.state.bank_id = "bankid"
            axios.put.mockImplementationOnce(() =>  Promise.resolve())

            await instance.updateBankRates()
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith(
                'https://mythical-mason-324813.ey.r.appspot.com//banks/bankid', 
                {
                    "class_code": "classc",
                    "interest_rate": 11,
                    "payout_rate": 2,
                }
            )
            expect(instance.state.updateBankModalShow).toBe(false)
        });
    })
    describe('validateBank testing', () => {
        it('should not pass first condition with empty interest rate', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = ""
            instance.validateBank()
            expect(instance.state.bank_error).toEqual("Please enter an interest rate")
        })
        it('should not pass second condition with empty payout rate', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = "intrate"
            instance.state.payout_rate = ""
            instance.validateBank()
            expect(instance.state.bank_error).toEqual("Please enter a payout rate")
        })
        it('should not pass third condition with non number interest rate', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = "intrate"
            instance.state.payout_rate = "payoutrate"
            instance.validateBank()
            expect(instance.state.bank_error).toEqual("Please enter a valid interest rate")
        })
        it('should not pass foruth condition with a interest rate lower than 0', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = -10
            instance.state.payout_rate = "payoutrate"
            instance.validateBank()
            expect(instance.state.bank_error).toEqual("Please enter a valid interest rate percentage")
        })
        it('should not pass foruth condition with a interest rate higher than 100', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = 110
            instance.state.payout_rate = "payoutrate"
            instance.validateBank()
            expect(instance.state.bank_error).toEqual("Please enter a valid interest rate percentage")
        })
        it('should not pass fifth condition with non number payout rate', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = 10
            instance.state.payout_rate = "payoutrate"
            instance.validateBank()
            expect(instance.state.bank_error).toEqual("Please enter a number for payout rate")
        })
        it('should pass', () =>{
            const instance = wrapper.instance()
            instance.state.interest_rate = 10
            instance.state.payout_rate = 1
            expect(instance.validateBank()).toBe(true)
        })
    })
    describe('createBankModal testing', () => {
        it('should render createBankModal modal but not show', () => {
            const instance = wrapper.instance()
            expect(instance.createBankModal()).toMatchSnapshot();
        });
        it('should render createBankModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.bankModalShow = true
            expect(instance.createBankModal()).toMatchSnapshot();
        });
    })
    describe('updateBankModal testing', () => {
        it('should render updateBank modal but not show', () => {
            const instance = wrapper.instance()
            instance.state.interest_rate = 10
            instance.state.payout_rate = 1
            expect(instance.updateBankModal()).toMatchSnapshot();
        });
        it('should render updateBank modal and show', () => {
            const instance = wrapper.instance()
            instance.state.interest_rate = 10
            instance.state.payout_rate = 1
            instance.state.updateBankModalShow = true
            expect(instance.updateBankModal()).toMatchSnapshot();
        });
    })
    describe('render testing', () => {
        it('should render default components', () => {
            expect(wrapper.getElements()).toMatchSnapshot();
        })
    })

})

const mockStudentData = jest.fn(() => {
    return {
        data: [
            {id: "studentid", name: "studentname", class_code: "classc", balance: "balance"}, 
            {id: "2studentid", name: "2studentname", class_code: "classc", balance: "2balance"}],
    };
});

const mockBankData = jest.fn(() => {
    return {
        data: [
            {id: "bankid", class_code: "classc", interest_rate: "intrate", payout_rate: "payrate"},
            {id: "2bankid", class_code: "classa", interest_rate: "intrate", payout_rate: "payrate"}],
    };
});

const mockTransactionInterestRates = jest.fn(() => {
    return {
        data: [
            {id: "traintrate", set_interest_rate: "7", transaction_id: "1", active: true, end_date: "15/12/2021"},
            {id: "traintrate2", set_interest_rate: "9", transaction_id: "2", active: false, end_date: "15/12/2021"}
        ],
    };
});

const mockTransactionData = jest.fn(() => {
    return {
        data:
            {id: "1", recipient_id: "bankid", sender_id: "studentid", category: "savings", amount: 10}
    };
});

const mockTransactionData2 = jest.fn(() => {
    return {
        data:
            {id: "2", recipient_id: "bankid", sender_id: "2studentid", category: "savings", amount: 5}
    };
});

const mockUserData = jest.fn(() => {
    return {
        data:
            {id: "studentid", username: "studentuser", first_name: "studentname", email: "studentemail@mail.com"}
    };
});

const mockUserData2 = jest.fn(() => {
    return {
        data:
            {id: "2studentid", username: "2studentuser", first_name: "2studentname", email: "2studentemail@mail.com"}
    };
});





//fields = ['id', 'class_code', 'interest_rate', 'payout_rate']
//fields = ['id', 'set_interest_rate', 'transaction_id', 'active', 'end_date']
//fields = ['id', 'recipient_id', 'sender_id', 'category', 'amount']
//fields = ('id', 'username', 'password', 'first_name', 'email')