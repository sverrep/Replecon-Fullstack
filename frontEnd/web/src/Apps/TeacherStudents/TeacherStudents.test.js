import React from 'react';
import TeacherStudents from './TeacherStudents.js'
import axios from 'axios'
jest.mock('axios');
let wrapper

describe('TeacherStudents Testing', () => {
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
        wrapper = shallow(<TeacherStudents.WrappedComponent {...props} />, { disableLifecycleMethods: true })
    })
    describe('componentMount testing', () => {
        it('should call the right functions', async () => {
            const instance = wrapper.instance()

            instance.getClassStudents = jest.fn()
            instance.getAllItems = jest.fn()

            await instance.componentDidMount()

            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.getAllItems).toHaveBeenCalledTimes(1)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const items = mockItemData()
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.componentDidMount()
            expect(instance.state.students).toEqual(students.data)
            expect(instance.state.all_items).toEqual(items.data)
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
    describe('getAllItems testing', () => {
        it('should reject axios call', async () => {
            const instance = wrapper.instance()

            axios.get.mockImplementationOnce(() => Promise.reject("Token not authenticated"))
            await instance.getAllItems()
            expect(instance.state.error).toBe("Token not authenticated")
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//items/')

        });

        it('should pass axios call and call set correct state', async () => {
            const instance = wrapper.instance()
            const items = mockItemData()
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getAllItems()
            expect(instance.state.all_items).toEqual(items.data)
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
    describe('studentClicked testing', () => {
        it('should add student to selected and call getBoughtItems', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]

            instance.getBoughtItems = jest.fn()

            instance.studentClicked(student)
            expect(instance.state.selected_name).toEqual(student.name)
            expect(instance.state.selected_balance).toEqual(student.balance)
            expect(instance.state.selected_id).toEqual(student.id)
            expect(instance.state.selected).toHaveLength(1)
            expect(instance.state.selected[0]).toEqual(student.id)
            expect(instance.getBoughtItems).toHaveBeenCalledTimes(1)

        });

        it('should find student in selected and remove them from it', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]
            instance.state.selected[0] = student.id

            instance.getBoughtItems = jest.fn()

            instance.studentClicked(student)
            expect(instance.state.selected_name).toEqual(student.name)
            expect(instance.state.selected_balance).toEqual(student.balance)
            expect(instance.state.selected_id).toEqual(student.id)
            expect(instance.state.selected).toHaveLength(0)
            expect(instance.getBoughtItems).toHaveBeenCalledTimes(0)

        });

        it('should find student in selected and remove them from it', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]
            const all_bought_items = mockBoughtItems()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(all_bought_items))

            instance.studentClicked(student)

            expect(instance.state.selected_name).toEqual(student.name)
            expect(instance.state.selected_balance).toEqual(student.balance)
            expect(instance.state.selected_id).toEqual(student.id)
            expect(instance.state.selected).toHaveLength(1)
            expect(instance.state.selected[0]).toEqual(student.id)
            expect(instance.state.display_items)

        });

    })
    describe('renderStudents testing', () => {
        it('should display not selected student', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]

            expect(instance.renderStudents(student)).toMatchSnapshot();

        });

        it('should display a selected student', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const student = students.data[0]
            instance.state.selected[0] = student.id
            expect(instance.renderStudents(student)).toMatchSnapshot();
        });


    })
    describe('changeSelected testing', () => {
        it('should not pass amountIsValid', async () => {
            const instance = wrapper.instance()
            instance.amountIsValid = jest.fn()
            instance.amountIsValid.mockReturnValueOnce(false)
            await instance.changeSelected()
            expect(instance.state.error).toEqual("Did not pass validation")
        });

        it('should not pass through loop', async () => {
            const instance = wrapper.instance()
            instance.amountIsValid = jest.fn()
            instance.amountIsValid.mockReturnValueOnce(true)
            instance.changeSelected()
            expect(axios.put).toHaveBeenCalledTimes(0)
            expect(instance.state.show).toBe(false)
        });

        it('should not pass through axios', async () => {
            const instance = wrapper.instance()
            instance.amountIsValid = jest.fn()
            instance.amountIsValid.mockReturnValueOnce(true)
            const students = mockStudentData()
            instance.state.selected[0] = students.data[0].id 

            axios.put.mockImplementationOnce(() => Promise.reject("Token not authenticated"))

            await instance.changeSelected()
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(0)
            expect(instance.state.error).toEqual("Token not authenticated")
        });

        it('should pass axios and call getClassStudents with negative amount', async () => {
            const instance = wrapper.instance()
            instance.amountIsValid = jest.fn()
            instance.amountIsValid.mockReturnValueOnce(true)
            const students = mockStudentData()
            instance.state.selected[0] = students.data[0].id 
            instance.state.amount = 10
            instance.getClassStudents = jest.fn()
            const user_id = {data: {user: "studentuserid"}}

            axios.put.mockImplementationOnce(() => Promise.resolve(user_id))
            axios.post.mockImplementationOnce(() => Promise.resolve())

            await instance.changeSelected()

            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//students/balance/", {"amount": "-10", "user_id": students.data[0].id})
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/",{"amount": "-10", "user_id": user_id.data.user})
            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.state.selected).toHaveLength(0)
        });

        it('should pass axios and call getClassStudents with positive amount', async () => {
            const instance = wrapper.instance()
            instance.amountIsValid = jest.fn()
            instance.amountIsValid.mockReturnValueOnce(true)
            const students = mockStudentData()
            instance.state.selected[0] = students.data[0].id 
            instance.state.amount = 10
            instance.getClassStudents = jest.fn()
            const user_id = {data: {user: "studentuserid"}}

            axios.put.mockImplementationOnce(() => Promise.resolve(user_id))
            axios.post.mockImplementationOnce(() => Promise.resolve())

            await instance.changeSelected(true)

            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//students/balance/", {"amount": 10, "user_id": students.data[0].id})
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/",{"amount": 10, "user_id": user_id.data.user})
            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.state.selected).toHaveLength(0)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            instance.state.selected[0] = students.data[0].id 
            instance.state.amount = 10
            const user_id = {data: {user: "studentuserid"}}

            axios.put.mockImplementationOnce(() => Promise.resolve(user_id))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))
            await instance.changeSelected(true)

            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//students/balance/", {"amount": 10, "user_id": students.data[0].id})
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/",{"amount": 10, "user_id": user_id.data.user})
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//students/')
            expect(instance.state.selected).toHaveLength(0)
            expect(instance.state.students).toEqual(students.data)
        });
    })
    describe('getBoughtItems testing', () => {
        it('should reject axios call', async () => {
            const instance = wrapper.instance()

            axios.get.mockImplementationOnce(() => Promise.reject("Token not authenticated"))
            await instance.getBoughtItems()
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//items/allboughtitems/")
            expect(instance.state.error).toEqual("Token not authenticated")

        });

        it('should pass axios call and find no bought items', async () => {
            const instance = wrapper.instance()
            const items = mockBoughtItems()
            const students = mockStudentData()
            instance.state.selected[0] = students.data[1].id
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getBoughtItems()
            expect(instance.state.display_items).toHaveLength(0)
        }); 

        it('should pass axios call and find set bought items to display state', async () => {
            const instance = wrapper.instance()
            const items = mockBoughtItems()
            const students = mockStudentData()
            instance.state.selected[0] = students.data[0].id
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getBoughtItems()
            expect(instance.state.display_items).toHaveLength(2)
            expect(instance.state.display_items).toEqual(items.data)
        });
    })
    describe('renderItems testing', () => {
        it('should not display not selected students', () => {
            const instance = wrapper.instance()
            const items = mockItemData()
            const item = items.data[0]

            expect(instance.renderItems(item)).toMatchSnapshot();

        });

        it('should display selected students items', () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const boughtitems = mockBoughtItems()
            const items = mockItemData()
            const student = students.data[0]
            const boughtitem = boughtitems.data[0]
            instance.state.selected[0] = student.id
            instance.state.students[0] = student
            instance.state.all_items[0] = items.data[0]
            expect(instance.renderItems(boughtitem)).toMatchSnapshot();
        });


    })
    describe('deleteSelected testing', () => {
        it('should not find any selected', async () => {
            const instance = wrapper.instance()
            await instance.deleteSelected()
            expect(axios.delete).toHaveBeenCalledTimes(0)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            instance.state.selected[0] = students.data[0].id 
            const user_id = {data: [{name: "BANK", id: 'bankid'}]}

            axios.delete.mockImplementationOnce(() => Promise.resolve())
            axios.get.mockImplementationOnce(() => Promise.resolve(user_id))
            axios.delete.mockImplementationOnce(() =>  Promise.resolve())
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))
            await instance.deleteSelected(true)
            expect(axios.delete).toHaveBeenCalledTimes(2)
            expect(axios.delete).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//users/studentid/")
            expect(axios.delete).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//transactioninterestrates/bankid")
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//transactions/getTransactionsByID/studentid')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//students/')
            expect(instance.state.students).toEqual(students.data)
        });
    })
    describe('amountIsValid testing', () => {
        it('should fail amountIsValid due to amount not being number', () => {
            const instance = wrapper.instance()
            const condition = instance.amountIsValid("yes")
            expect(instance.state.error).toBe("Make sure that amount is a number")
            expect(condition).toBe(false)
        });
        
        it('should fail amountIsValid due to negative number', () => {
            const instance = wrapper.instance()
            const condition = instance.amountIsValid(-10)
            expect(instance.state.error).toBe("Make sure that amount is a positive number")
            expect(condition).toBe(false)
        });

        it('should pass', () => {
            const instance = wrapper.instance()
            const condition = instance.amountIsValid(10)
            expect(instance.state.error).toBe(undefined)
            expect(condition).toBe(true)
        });
    })
    describe('component render testing', () => {
        it('TeacherStudents page renders default correctly', async () => {
            expect(wrapper.getElements()).toMatchSnapshot();
        })
        
    })

})

const mockStudentData = jest.fn(() => {
    return {
        data: [{id: "studentid", name: "studentname", class_code: "classc", balance: "balance"}, {id: "2studentid", name: "2studentname", class_code: "classc", balance: "2balance"}],
    };
});

const mockItemData = jest.fn(() => {
    return {
        data: [{id: "itemid", item_name: "itemname", description: "itemdesc", price: "itemprice", shop_id: "itemshopid"}, {id: "2itemid", item_name: "2itemname", description: "2itemdesc", price: "2itemprice", shop_id: "2itemshopid"}]
    };
});

const mockBoughtItems = jest.fn(() => {
    return {
        data: [{item_id: "itemid", user_id: "studentid"}, {item_id: "2itemid", user_id: "studentid"}]
    };
});


//{"id": student.user.id, "name": student.user.first_name, "class_code": student.class_code, "balance": student.balance}
//fields = ['id', 'item_name', 'description', 'price', 'shop_id']
//fields = ['item_id', 'user_id']