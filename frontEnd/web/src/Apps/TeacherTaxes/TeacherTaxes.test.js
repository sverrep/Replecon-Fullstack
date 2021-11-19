import React from 'react';
import ReactDOM, { render } from 'react-dom';
import axios from 'axios'
import TeacherTaxes from './TeacherTaxes.js';
jest.mock('axios');
let wrapper

describe('TeacherTaxes Testing', () => {
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
        wrapper = shallow(<TeacherTaxes.WrappedComponent {...props} />, { disableLifecycleMethods: true })
    })
    describe('componentMount testing', () => {
        it('should call the right functions', async () => {
            const instance = wrapper.instance()

            instance.getClassStudents = jest.fn()
            instance.getTaxes = jest.fn()

            await instance.componentDidMount()

            expect(instance.getClassStudents).toHaveBeenCalledTimes(1)
            expect(instance.getTaxes).toHaveBeenCalledTimes(1)
            expect(instance.getTaxes).toHaveBeenCalledWith("local")
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const students = mockStudentData()
            const taxes = mockTaxData()

            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(students))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(taxes))

            await instance.componentDidMount()
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(instance.state.students).toEqual(students.data)
            expect(instance.state.classHasTaxes).toBe(true)
            expect(instance.state.class_tax).toEqual(taxes.data[0])
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
    describe('getTaxes testing', () => {
        it('should pass axios call and call checkForClassTax', async () => {
            const instance = wrapper.instance()
            const taxes = mockTaxData()
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(taxes))
            instance.checkForClassTax = jest.fn()

            await instance.getTaxes("local")
            expect(instance.checkForClassTax).toHaveBeenCalledTimes(1)
            expect(instance.checkForClassTax).toHaveBeenCalledWith(taxes.data, "local")
        }); 

        it('should pass axios call and set taxes', async () => {
            const instance = wrapper.instance()
            const taxes = mockTaxData()
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(taxes))

            await instance.getTaxes("local")
            expect(instance.state.classHasTaxes).toBe(true)
            expect(instance.state.class_tax).toEqual(taxes.data[0])
        }); 
    })
    describe('checkForClassTax testing', () => {
        it('should set for local', async () => {
            const instance = wrapper.instance()
            const taxes = mockTaxData()

            await instance.checkForClassTax(taxes.data, "local")
            expect(instance.state.classHasTaxes).toBe(true)
            expect(instance.state.class_tax).toEqual(taxes.data[0])
        }); 

        it('should set for import', async () => {
            const instance = wrapper.instance()
            const taxes = mockTaxData()
            instance.state.tax_import_class_code = "classa"

            await instance.checkForClassTax(taxes.data, "import")
            expect(instance.state.tax_import_taxes).toEqual(taxes.data[1])
            
        }); 
    })
    describe('setUpTax testing', () => {
        it('should fail validation', async () => {
            const instance = wrapper.instance()
            instance.setupIsValid = jest.fn()
            instance.setupIsValid.mockReturnValueOnce(false)

            await instance.setUpTax()
            expect(instance.setupIsValid).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledTimes(0)
        }); 

        it('should pass', async () => {
            const instance = wrapper.instance()
            const taxes = mockTaxData()
            const brackets = mockBracketData()
            instance.state.current_sales_tax = 10
            instance.state.current_percent_tax = 5
            instance.state.current_flat_tax = 15
            const tax_promise = {data: 
                {id: "taxid", class_code: "classc", sales_tax: 10, percentage_tax: 5, flat_tax: 15}
            }
            const progBracket = {
                tax_id: "taxid", 
                lower_bracket: brackets.data[0].lower_bracket, 
                higher_bracket: brackets.data[0].higher_bracket, 
                percentage: brackets.data[0].percentage
            }
            instance.state.arOfLows = [brackets.data[1].lower_bracket]
            instance.state.arOfHighs = [brackets.data[1].higher_bracket]
            instance.state.arOfPer = [brackets.data[1].percentage]
            instance.state.regArOfLows = [brackets.data[0].lower_bracket]
            instance.state.regArOfHighs = [brackets.data[0].higher_bracket]
            instance.state.regArOfPer = [brackets.data[0].percentage]
            instance.state.progAmount = 1
            instance.state.regAmount = 1

            axios.post.mockImplementationOnce(() => Promise.resolve(tax_promise))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.get.mockImplementation(() =>  Promise.resolve(taxes))


            await instance.setUpTax()
            expect(axios.post).toHaveBeenCalledTimes(3)
            expect(axios.post).toHaveBeenCalledWith(
                'https://mythical-mason-324813.ey.r.appspot.com//taxes/', 
                {"class_code": "classc", "flat_tax": 15, "percentage_tax": 5, "sales_tax": 10}
            )
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//progressivebrackets/", 
                {"higher_bracket": 12, "lower_bracket": 1, "percentage": 15, "tax_id": "taxid"}
            )
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//regressivebrackets/", 
                {"higher_bracket": 10, "lower_bracket": 1, "percentage": 10, "tax_id": "taxid"}
            )
            expect(axios.get).toHaveBeenCalledTimes(3)
            expect(axios.get).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//taxes/")
            expect(instance.state.class_tax).toEqual(taxes.data[0])
            expect(instance.state.classHasTaxes).toBe(true)
            expect(instance.state.showCreateTaxes).toBe(false)
            
        }); 
    })
    describe('renderBracket testing', () => {
        it('should render reg brackets properly', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()

            instance.state.arOfLows = [brackets.data[1].lower_bracket]
            instance.state.arOfHighs = [brackets.data[1].higher_bracket]
            instance.state.arOfPer = [brackets.data[1].percentage]

            expect(instance.renderBracket(0, "prog")).toMatchSnapshot();
        });
        it('should render reg brackets properly', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfLows = [brackets.data[0].lower_bracket]
            instance.state.regArOfHighs = [brackets.data[0].higher_bracket]
            instance.state.regArOfPer = [brackets.data[0].percentage]

            expect(instance.renderBracket(0, "reg")).toMatchSnapshot();
        });
    })
    describe('defaultLowValue testing', () => {
        it('should set prog value', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.arOfLows = [brackets.data[1].lower_bracket]

            expect(instance.defaultLowValue(0, "prog")).toEqual(instance.state.arOfLows[0])
        });
        it('should set reg value', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfLows = [brackets.data[0].lower_bracket]

            expect(instance.defaultLowValue(0, "reg")).toEqual(instance.state.regArOfLows[0])
        });
    })
    describe('defaultHighValue testing', () => {
        it('should set prog value', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.arOfHighs = [brackets.data[1].higher_bracket]

            expect(instance.defaultHighValue(0, "prog")).toEqual(instance.state.arOfHighs[0])
        });
        it('should set reg value', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfHighs = [brackets.data[0].higher_bracket]

            expect(instance.defaultHighValue(0, "reg")).toEqual(instance.state.regArOfHighs[0])
        });
    })
    describe('defaultPerValue testing', () => {
        it('should set prog value', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.arOfPer = [brackets.data[1].percentage]

            expect(instance.defaultPerValue(0, "prog")).toEqual(instance.state.arOfPer[0])
        });
        it('should set reg value', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfPer = [brackets.data[0].percentage]

            expect(instance.defaultPerValue(0, "reg")).toEqual(instance.state.regArOfPer[0])
        });
    })
    describe('progBracketClicked testing', () => {
        it('should increase', () => {
            const instance = wrapper.instance()
            instance.progBracketClicked("plus")
            expect(instance.state.progAmount).toEqual(1)
        });
        it('should decrease', () => {
            const instance = wrapper.instance()
            instance.state.progAmount = 1
            instance.progBracketClicked("minus")
            expect(instance.state.progAmount).toEqual(0)
        });
        it('should not decrease if amount is already 0', () => {
            const instance = wrapper.instance()
            instance.progBracketClicked("minus")
            expect(instance.state.progAmount).toEqual(0)
        });
    })
    describe('regBracketClicked testing', () => {
        it('should increase', () => {
            const instance = wrapper.instance()
            instance.regBracketClicked("plus")
            expect(instance.state.regAmount).toEqual(1)
        });
        it('should decrease', () => {
            const instance = wrapper.instance()
            instance.state.regAmount = 1
            instance.regBracketClicked("minus")
            expect(instance.state.regAmount).toEqual(0)
        });
        it('should not decrease if amount is already 0', () => {
            const instance = wrapper.instance()
            instance.regBracketClicked("minus")
            expect(instance.state.regAmount).toEqual(0)
        });
    })
    describe('regBracketClicked testing', () => {
        it('should go through prog', () => {
            const instance = wrapper.instance()
            instance.state.progAmount = 3
            instance.state.regAmount = 1
            instance.renderBracket = jest.fn()
            instance.renderAmount("prog")
            expect(instance.renderBracket).toHaveBeenCalledTimes(3)
        });
        it('should go through reg', () => {
            const instance = wrapper.instance()
            instance.state.regAmount = 1
            instance.state.progAmount = 3
            instance.renderBracket = jest.fn()
            instance.renderAmount("reg")
            expect(instance.renderBracket).toHaveBeenCalledTimes(1)
        });

    })
    describe('onUpdateLowChange testing', () => {
        it('should go through prog', () => {
            const instance = wrapper.instance()
            const e = {target: {value: "text"}}

            instance.onUpdateLowChange(e, 0, "prog")
            expect(instance.state.current_low).toEqual(e.target.value)
        });
        it('should go through reg', () => {
            const instance = wrapper.instance()
            const e = {target: {value: "text"}}

            instance.onUpdateLowChange(e, 0, "reg")
            expect(instance.state.current_low).toEqual(e.target.value)
        });

    })
    describe('onUpdateHighChange testing', () => {
        it('should go through prog', () => {
            const instance = wrapper.instance()
            const e = {target: {value: "text"}}

            instance.onUpdateHighChange(e, 0, "prog")
            expect(instance.state.current_high).toEqual(e.target.value)
        });
        it('should go through reg', () => {
            const instance = wrapper.instance()
            const e = {target: {value: "text"}}

            instance.onUpdateHighChange(e, 0, "reg")
            expect(instance.state.current_high).toEqual(e.target.value)
        });

    })
    describe('onUpdatePerChange testing', () => {
        it('should go through prog', () => {
            const instance = wrapper.instance()
            const e = {target: {value: "text"}}

            instance.onUpdatePerChange(e, 0, "prog")
            expect(instance.state.current_per).toEqual(e.target.value)
        });
        it('should go through reg', () => {
            const instance = wrapper.instance()
            const e = {target: {value: "text"}}

            instance.onUpdatePerChange(e, 0, "reg")
            expect(instance.state.current_per).toEqual(e.target.value)
        });

    })
    describe('updateEasyTax testing', () => {
        it('should go through flat tax', () => {
            const instance = wrapper.instance()
            instance.state.class_tax.class_code = "classc"
            instance.state.class_tax.sales_tax = 10
            instance.state.class_tax.percentage_tax = 5
            instance.state.current_flat_tax = 15
            instance.state.class_tax.id = "taxid"
            const payload = {
                class_code: "classc",
                flat_tax: 15,
                percentage_tax: 5,
                sales_tax: 10,
                id: "taxid",
            }

            axios.put.mockImplementationOnce(() => Promise.resolve())

            instance.updateEasyTax("Flat Tax")
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//taxes/taxid", payload
            )
            expect(instance.state.class_tax).toEqual(payload)
            expect(instance.state.showUpdateTax).toBe(false)
        });
        it('should go through percentage tax', () => {
            const instance = wrapper.instance()
            instance.state.class_tax.class_code = "classc"
            instance.state.class_tax.sales_tax = 10
            instance.state.current_percent_tax = 5
            instance.state.class_tax.flat_tax = 15
            instance.state.class_tax.id = "taxid"
            const payload = {
                class_code: "classc",
                flat_tax: 15,
                percentage_tax: 5,
                sales_tax: 10,
                id: "taxid",
            }

            axios.put.mockImplementationOnce(() => Promise.resolve())

            instance.updateEasyTax("Percentage Tax")
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//taxes/taxid", payload
            )
            expect(instance.state.class_tax).toEqual(payload)
            expect(instance.state.showUpdateTax).toBe(false)
        });

    })
    describe('updateBrackets testing', () => {
        it('should go through progressive', () => {
            const instance = wrapper.instance()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            instance.state.class_tax.id = "taxid"
            instance.state.progArOfId[0] = "progid"
            const payload = {
                tax_id: "taxid",
                lower_bracket: 1,
                higher_bracket: 10,
                percentage: 5,
            }

            axios.put.mockImplementationOnce(() => Promise.resolve())

            instance.updateBrackets("Progressive Tax")
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//progressivebrackets/progid", payload
            )
            expect(instance.state.showUpdateTax).toBe(false)
        });
        it('should go through regressive', () => {
            const instance = wrapper.instance()
            instance.state.regArOfLows[0] = 1
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            instance.state.class_tax.id = "taxid"
            instance.state.regArOfId[0] = "regid"
            const payload = {
                tax_id: "taxid",
                lower_bracket: 1,
                higher_bracket: 10,
                percentage: 5,
            }

            axios.put.mockImplementationOnce(() => Promise.resolve())

            instance.updateBrackets("Regressive Tax")
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//regressivebrackets/regid", payload
            )
            expect(instance.state.showUpdateTax).toBe(false)
        });

    })
    describe('progArraySetUp testing', () => {
        it('should pass', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            instance.state.progArOfId[0] = "progid"

            instance.progArraySetUp(brackets.data)
            expect(instance.state.arOfHighs).toEqual([brackets.data[0].higher_bracket, brackets.data[1].higher_bracket])
            expect(instance.state.arOfLows).toEqual([brackets.data[0].lower_bracket, brackets.data[1].lower_bracket])
            expect(instance.state.arOfPer).toEqual([brackets.data[0].percentage, brackets.data[1].percentage])
            expect(instance.state.progArOfId).toEqual([brackets.data[0].id, brackets.data[1].id])
        });
    })
    describe('regArraySetUp testing', () => {
        it('should pass', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfLows[0] = 1
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            instance.state.regArOfId[0] = "regid"

            instance.regArraySetUp(brackets.data)
            expect(instance.state.regArOfHighs).toEqual([brackets.data[0].higher_bracket, brackets.data[1].higher_bracket])
            expect(instance.state.regArOfLows).toEqual([brackets.data[0].lower_bracket, brackets.data[1].lower_bracket])
            expect(instance.state.regArOfPer).toEqual([brackets.data[0].percentage, brackets.data[1].percentage])
            expect(instance.state.regArOfId).toEqual([brackets.data[0].id, brackets.data[1].id])
        });

    })
    describe('getClassProgressiveBrackets testing', () => {
        it('should pass local', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            instance.state.progArOfId[0] = "progid"
            instance.state.class_tax.id = "taxid"

            instance.getClassProgressiveBrackets(brackets.data, "local")
            expect(instance.state.arOfHighs).toEqual([brackets.data[0].higher_bracket, brackets.data[1].higher_bracket])
            expect(instance.state.arOfLows).toEqual([brackets.data[0].lower_bracket, brackets.data[1].lower_bracket])
            expect(instance.state.arOfPer).toEqual([brackets.data[0].percentage, brackets.data[1].percentage])
            expect(instance.state.progArOfId).toEqual([brackets.data[0].id, brackets.data[1].id])
            expect(instance.state.class_prog_brackets).toEqual(brackets.data)
            expect(instance.state.progAmount).toEqual(brackets.data.length)
        });
        it('should pass import', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            instance.state.progArOfId[0] = "progid"
            instance.state.tax_import_taxes.id = "taxid"

            instance.getClassProgressiveBrackets(brackets.data, "import")
            expect(instance.state.arOfHighs).toEqual([brackets.data[0].higher_bracket, brackets.data[1].higher_bracket])
            expect(instance.state.arOfLows).toEqual([brackets.data[0].lower_bracket, brackets.data[1].lower_bracket])
            expect(instance.state.arOfPer).toEqual([brackets.data[0].percentage, brackets.data[1].percentage])
            expect(instance.state.progArOfId).toEqual([brackets.data[0].id, brackets.data[1].id])
            expect(instance.state.tax_import_prog).toEqual(brackets.data)
        });
    })
    describe('getClassRegressiveBrackets testing', () => {
        it('should pass local', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfLows[0] = 1
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            instance.state.regArOfId[0] = "regid"
            instance.state.class_tax.id = "taxid"

            instance.getClassRegressiveBrackets(brackets.data, "local")
            expect(instance.state.regArOfHighs).toEqual([brackets.data[0].higher_bracket, brackets.data[1].higher_bracket])
            expect(instance.state.regArOfLows).toEqual([brackets.data[0].lower_bracket, brackets.data[1].lower_bracket])
            expect(instance.state.regArOfPer).toEqual([brackets.data[0].percentage, brackets.data[1].percentage])
            expect(instance.state.regArOfId).toEqual([brackets.data[0].id, brackets.data[1].id])
            expect(instance.state.class_reg_brackets).toEqual(brackets.data)
            expect(instance.state.regAmount).toEqual(brackets.data.length)
        });
        it('should pass import', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.regArOfLows[0] = 1
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            instance.state.regArOfId[0] = "regid"
            instance.state.tax_import_taxes.id = "taxid"

            instance.getClassRegressiveBrackets(brackets.data, "import")
            expect(instance.state.regArOfHighs).toEqual([brackets.data[0].higher_bracket, brackets.data[1].higher_bracket])
            expect(instance.state.regArOfLows).toEqual([brackets.data[0].lower_bracket, brackets.data[1].lower_bracket])
            expect(instance.state.regArOfPer).toEqual([brackets.data[0].percentage, brackets.data[1].percentage])
            expect(instance.state.regArOfId).toEqual([brackets.data[0].id, brackets.data[1].id])
            expect(instance.state.tax_import_reg).toEqual(brackets.data)
        });
    })
    describe('getAllBrackets testing', () => {
        it('should pass local', async () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.class_tax.id = "taxid"

            const prog_response = {data: [{
                id: "bracketid", tax_id: "taxid", lower_bracket: 1, higher_bracket: 10, percentage: 10
            }]}
            const reg_response = {data: [{
                id: "2bracketid", tax_id: "taxid", lower_bracket: 1, higher_bracket: 12, percentage: 15
            }]}

            axios.get.mockImplementationOnce(() => Promise.resolve(prog_response))
            axios.get.mockImplementationOnce(() => Promise.resolve(reg_response))

            await instance.getAllBrackets("local")
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//progressivebrackets/')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//regressivebrackets/')
            expect(instance.state.arOfHighs).toEqual([brackets.data[0].higher_bracket])
            expect(instance.state.arOfLows).toEqual([brackets.data[0].lower_bracket])
            expect(instance.state.arOfPer).toEqual([brackets.data[0].percentage])
            expect(instance.state.progArOfId).toEqual([brackets.data[0].id])
            expect(instance.state.class_prog_brackets).toEqual([brackets.data[0]])
            expect(instance.state.progAmount).toEqual(1)
            expect(instance.state.regArOfHighs).toEqual([brackets.data[1].higher_bracket])
            expect(instance.state.regArOfLows).toEqual([brackets.data[1].lower_bracket])
            expect(instance.state.regArOfPer).toEqual([brackets.data[1].percentage])
            expect(instance.state.regArOfId).toEqual([brackets.data[1].id])
            expect(instance.state.class_reg_brackets).toEqual([brackets.data[1]])
            expect(instance.state.regAmount).toEqual(1)
        });
        it('should pass import', async () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.tax_import_taxes.id = "taxid"

            const prog_response = {data: [{
                id: "bracketid", tax_id: "taxid", lower_bracket: 1, higher_bracket: 10, percentage: 10
            }]}
            const reg_response = {data: [{
                id: "2bracketid", tax_id: "taxid", lower_bracket: 1, higher_bracket: 12, percentage: 15
            }]}

            axios.get.mockImplementationOnce(() => Promise.resolve(prog_response))
            axios.get.mockImplementationOnce(() => Promise.resolve(reg_response))

            await instance.getAllBrackets("import")
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//progressivebrackets/')
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//regressivebrackets/')
            expect(instance.state.arOfHighs).toEqual([brackets.data[0].higher_bracket])
            expect(instance.state.arOfLows).toEqual([brackets.data[0].lower_bracket])
            expect(instance.state.arOfPer).toEqual([brackets.data[0].percentage])
            expect(instance.state.progArOfId).toEqual([brackets.data[0].id])
            expect(instance.state.tax_import_prog).toEqual([brackets.data[0]])
            expect(instance.state.regArOfHighs).toEqual([brackets.data[1].higher_bracket])
            expect(instance.state.regArOfLows).toEqual([brackets.data[1].lower_bracket])
            expect(instance.state.regArOfPer).toEqual([brackets.data[1].percentage])
            expect(instance.state.regArOfId).toEqual([brackets.data[1].id])
            expect(instance.state.tax_import_reg).toEqual([brackets.data[1]])
        });
    })
    describe('taxClickedItem testing', () => {
        it('should go through flat tax', () => {
            const instance = wrapper.instance()
            instance.getAllBrackets = jest.fn()
            instance.state.class_tax.flat_tax = "flat"

            instance.taxClickedItem("Flat Tax")
            expect(instance.getAllBrackets).toHaveBeenCalledTimes(1)
            expect(instance.state.showUpdateTax).toBe(true)
            expect(instance.state.current_value).toEqual(instance.state.class_tax.flat_tax)
            expect(instance.state.form_id).toEqual("current_flat_tax")
        });
        it('should go through percentage tax', () => {
            const instance = wrapper.instance()
            instance.getAllBrackets = jest.fn()
            instance.state.class_tax.percentage_tax = "percent"

            instance.taxClickedItem("Percentage Tax")
            expect(instance.getAllBrackets).toHaveBeenCalledTimes(1)
            expect(instance.state.showUpdateTax).toBe(true)
            expect(instance.state.current_value).toEqual(instance.state.class_tax.percentage_tax)
            expect(instance.state.form_id).toEqual("current_percent_tax")
        });
        it('should go through progressive tax', () => {
            const instance = wrapper.instance()
            instance.getAllBrackets = jest.fn()

            instance.taxClickedItem("Progressive Tax")
            expect(instance.getAllBrackets).toHaveBeenCalledTimes(1)
            expect(instance.state.showUpdateTax).toBe(true)
        });
        it('should go through regressive tax', () => {
            const instance = wrapper.instance()
            instance.getAllBrackets = jest.fn()

            instance.taxClickedItem("Regressive Tax")
            expect(instance.getAllBrackets).toHaveBeenCalledTimes(1)
            expect(instance.state.showUpdateTax).toBe(true)
        });

    })
    describe('hasTaxes testing', () => {
        it('should render hasTaxes view', () => {
            const instance = wrapper.instance()

            instance.state.class_name = "Testclass"
            instance.state.class_tax.id = 12

            expect(instance.hasTaxes()).toMatchSnapshot();
        });
    })
    describe('hasNoTaxes testing', () => {
        it('should render hasNoTaxes view', () => {
            const instance = wrapper.instance()

            expect(instance.hasNoTaxes()).toMatchSnapshot();
        });
    })
    describe('renderTaxView testing', () => {
        it('should call hasTaxes view', () => {
            const instance = wrapper.instance()
            instance.hasTaxes = jest.fn()
            instance.hasNoTaxes = jest.fn()
            instance.state.classHasTaxes = true
            instance.renderTaxView()
            expect(instance.hasTaxes).toHaveBeenCalledTimes(1)
            expect(instance.hasNoTaxes).toHaveBeenCalledTimes(0)
            
        });
        it('should call hasNoTaxes view', () => {
            const instance = wrapper.instance()
            instance.hasTaxes = jest.fn()
            instance.hasNoTaxes = jest.fn()

            instance.renderTaxView()
            expect(instance.hasTaxes).toHaveBeenCalledTimes(0)
            expect(instance.hasNoTaxes).toHaveBeenCalledTimes(1)
        });
    })
    describe('setupIsValid testing', () => {
        it('should call the right functions and return true', () => {
            const instance = wrapper.instance()
            instance.flat_tax_isValid = jest.fn()
            instance.flat_tax_isValid.mockReturnValueOnce(true)
            instance.percentage_tax_isValid = jest.fn()
            instance.percentage_tax_isValid.mockReturnValueOnce(true)
            instance.sales_tax_isValid = jest.fn()
            instance.sales_tax_isValid.mockReturnValueOnce(true)
            instance.regressive_taxes_isValid = jest.fn()
            instance.regressive_taxes_isValid.mockReturnValueOnce(true)
            instance.progressive_taxes_isValid = jest.fn()
            instance.progressive_taxes_isValid.mockReturnValueOnce(true)
            expect(instance.setupIsValid()).toBe(true)
            expect(instance.flat_tax_isValid).toHaveBeenCalledTimes(1)
            expect(instance.percentage_tax_isValid).toHaveBeenCalledTimes(1)
            expect(instance.sales_tax_isValid).toHaveBeenCalledTimes(1)
            expect(instance.regressive_taxes_isValid).toHaveBeenCalledTimes(1)
            expect(instance.progressive_taxes_isValid).toHaveBeenCalledTimes(1)
        })
        it('should pass', () => {
            const instance = wrapper.instance()
            instance.state.current_flat_tax = 10
            instance.state.current_percent_tax = 5
            instance.state.current_sales_tax = 15
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            instance.state.regArOfLows[0] = 1
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            expect(instance.setupIsValid()).toBe(true)
        })
    })
    describe('flat_tax_isValid testing', () => {
        it('should not pass if not a number', () => {
            const instance = wrapper.instance()
            expect(instance.flat_tax_isValid("yo")).toBe(false)
        })
        it('should not pass if not a positive number', () => {
            const instance = wrapper.instance()
            expect(instance.flat_tax_isValid(-10)).toBe(false)
        })
        it('should pass ', () => {
            const instance = wrapper.instance()
            expect(instance.flat_tax_isValid(10)).toBe(true)

        })
    })
    describe('percentage_tax_isValid testing', () => {
        it('should not pass if not a number', () => {
            const instance = wrapper.instance()
            expect(instance.percentage_tax_isValid("yo")).toBe(false)
        })
        it('should not pass if larger than 100', () => {
            const instance = wrapper.instance()
            expect(instance.percentage_tax_isValid(110)).toBe(false)
        })
        it('should not pass if not a positive number', () => {
            const instance = wrapper.instance()
            expect(instance.percentage_tax_isValid(-10)).toBe(false)
        })
        it('should pass ', () => {
            const instance = wrapper.instance()
            expect(instance.percentage_tax_isValid(10)).toBe(true)
        })
    })
    describe('sales_tax_isValid testing', () => {
        it('should not pass if not a number', () => {
            const instance = wrapper.instance()
            expect(instance.sales_tax_isValid("yo")).toBe(false)
        })
        it('should not pass if larger than 100', () => {
            const instance = wrapper.instance()
            expect(instance.sales_tax_isValid(110)).toBe(false)
        })
        it('should not pass if not a positive number', () => {
            const instance = wrapper.instance()
            expect(instance.sales_tax_isValid(-10)).toBe(false)
        })
        it('should pass ', () => {
            const instance = wrapper.instance()
            expect(instance.sales_tax_isValid(10)).toBe(true)
        })
    })
    describe('progressive_taxes_isValid testing', () => {
        it('should not pass if not a number', () => {
            const instance = wrapper.instance()
            instance.state.arOfLows[0] = "yo"
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            expect(instance.progressive_taxes_isValid()).toBe(false)
        })
        it('should not pass if larger than 100', () => {
            const instance = wrapper.instance()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = "flase"
            instance.state.arOfPer[0] = 5
            expect(instance.progressive_taxes_isValid()).toBe(false)
        })
        it('should not pass if not a positive number', () => {
            const instance = wrapper.instance()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = "fakes"
            expect(instance.progressive_taxes_isValid()).toBe(false)
        })
        it('should pass ', () => {
            const instance = wrapper.instance()
            instance.state.arOfLows[0] = 1
            instance.state.arOfHighs[0] = 10
            instance.state.arOfPer[0] = 5
            expect(instance.progressive_taxes_isValid()).toBe(true)
        })
    })
    describe('regressive_taxes_isValid testing', () => {
        it('should not pass if not a number', () => {
            const instance = wrapper.instance()
            instance.state.regArOfLows[0] = "yo"
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            expect(instance.regressive_taxes_isValid()).toBe(false)
        })
        it('should not pass if larger than 100', () => {
            const instance = wrapper.instance()
            instance.state.regArOfLows[0] = 10
            instance.state.regArOfHighs[0] = "passno"
            instance.state.regArOfPer[0] = 5
            expect(instance.regressive_taxes_isValid()).toBe(false)
        })
        it('should not pass if not a positive number', () => {
            const instance = wrapper.instance()
            instance.state.regArOfLows[0] = 10
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = "nopass"
            expect(instance.regressive_taxes_isValid()).toBe(false)
        })
        it('should pass ', () => {
            const instance = wrapper.instance()
            instance.state.regArOfLows[0] = 15
            instance.state.regArOfHighs[0] = 10
            instance.state.regArOfPer[0] = 5
            expect(instance.regressive_taxes_isValid()).toBe(true)
        })
    })
    describe('checkIfNumValid testing', () => {
        it('should not pass if not a number', () => {
            const instance = wrapper.instance()
            expect(instance.checkIfNumValid("yo")).toBe(false)
        })
        it('should not pass if not a positive number', () => {
            const instance = wrapper.instance()
            expect(instance.checkIfNumValid(-10)).toBe(false)
        })
        it('should pass ', () => {
            const instance = wrapper.instance()
            expect(instance.checkIfNumValid(10)).toBe(true)

        })
    })
    describe('taxTheClass testing', () => {
        it('should pass with flat tax', async () => {
            const instance = wrapper.instance()
            instance.state.students = mockStudentData().data
            instance.state.class_tax.flat_tax = 10
            const getresponse1 = {data: {user: "studentid"}}
            const getresponse2 = {data: {user: "2studentid"}}

            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse1))
            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse2))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.post.mockImplementationOnce(() => Promise.resolve())


            await instance.taxTheClass("Flat Tax")
            expect(axios.put).toHaveBeenCalledTimes(instance.state.students.length)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-${instance.state.class_tax.flat_tax}`, user_id: instance.state.students[0].id}
            )
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-${instance.state.class_tax.flat_tax}`, user_id: instance.state.students[1].id}
            )
            expect(axios.post).toHaveBeenCalledTimes(2)
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-${instance.state.class_tax.flat_tax}`, user_id: instance.state.students[0].id}
            )
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-${instance.state.class_tax.flat_tax}`, user_id: instance.state.students[1].id}
            )
        })
        it('should pass with percentage tax', async () => {
            const instance = wrapper.instance()
            instance.state.students = mockStudentData().data
            instance.state.class_tax.percentage_tax = 10
            const getresponse1 = {data: {user: "studentid"}}
            const getresponse2 = {data: {user: "2studentid"}}

            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse1))
            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse2))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.post.mockImplementationOnce(() => Promise.resolve())


            await instance.taxTheClass("Percentage Tax")
            expect(axios.put).toHaveBeenCalledTimes(instance.state.students.length)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-1.00`, user_id: instance.state.students[0].id}
            )
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-2.00`, user_id: instance.state.students[1].id}
            )
            expect(axios.post).toHaveBeenCalledTimes(2)
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-1.00`, user_id: instance.state.students[0].id}
            )
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-2.00`, user_id: instance.state.students[1].id}
            )
            
        })
        it('should pass with progressive tax', async () => {
            const instance = wrapper.instance()
            instance.state.students = mockStudentData().data
            const getresponse1 = {data: {user: "studentid"}}
            const getresponse2 = {data: {user: "2studentid"}}
            const brackets = mockBracketData()
            instance.state.class_prog_brackets[0] = brackets.data[0]

            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse1))
            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse2))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.post.mockImplementationOnce(() => Promise.resolve())


            await instance.taxTheClass("Progressive Tax")
            expect(axios.put).toHaveBeenCalledTimes(instance.state.students.length)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-0.90`, user_id: instance.state.students[0].id}
            )
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-0.90`, user_id: instance.state.students[1].id}
            )
            expect(axios.post).toHaveBeenCalledTimes(2)
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-0.90`, user_id: instance.state.students[0].id}
            )
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-0.90`, user_id: instance.state.students[1].id}
            )
        })
        it('should pass with regressive tax', async () => {
            const instance = wrapper.instance()
            instance.state.students = mockStudentData().data
            const getresponse1 = {data: {user: "studentid"}}
            const getresponse2 = {data: {user: "2studentid"}}
            const brackets = mockBracketData()
            instance.state.class_reg_brackets[0] = brackets.data[1]

            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse1))
            axios.put.mockImplementationOnce(() => Promise.resolve(getresponse2))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.post.mockImplementationOnce(() => Promise.resolve())


            await instance.taxTheClass("Regressive Tax")
            expect(axios.put).toHaveBeenCalledTimes(instance.state.students.length)
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-1.35`, user_id: instance.state.students[0].id}
            )
            expect(axios.put).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//students/balance/", 
                {amount: `-1.65`, user_id: instance.state.students[1].id}
            )
            expect(axios.post).toHaveBeenCalledTimes(2)
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-1.35`, user_id: instance.state.students[0].id}
            )
            expect(axios.post).toHaveBeenCalledWith(
                "https://mythical-mason-324813.ey.r.appspot.com//transactions/teacherPayStudents/", 
                {amount: `-1.65`, user_id: instance.state.students[1].id}
            )
        })
    })
    describe('getProgressiveTaxAmount testing', () => {
        it('should pass with balance > higher bracket', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.class_prog_brackets[0] = brackets.data[0]
            const wrongresult = 
                (20 - instance.state.class_prog_brackets[0].lower_bracket) 
                * (instance.state.class_prog_brackets[0].percentage/100)
            const expectresult = 
                (instance.state.class_prog_brackets[0].higher_bracket - instance.state.class_prog_brackets[0].lower_bracket) 
                * (instance.state.class_prog_brackets[0].percentage/100)
            const result = instance.getProgressiveTaxAmount(20)
            expect(result).not.toEqual(wrongresult)
            expect(result).toEqual(expectresult)

        })
        it('should pass with balance < higher bracket', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.class_prog_brackets[0] = brackets.data[0]
            const expectresult = 
                (5 - instance.state.class_prog_brackets[0].lower_bracket) 
                * (instance.state.class_prog_brackets[0].percentage/100)
            const wrongresult = 
                (instance.state.class_prog_brackets[0].higher_bracket - instance.state.class_prog_brackets[0].lower_bracket) 
                * (instance.state.class_prog_brackets[0].percentage/100)
            const result = instance.getProgressiveTaxAmount(5)
            expect(result).not.toEqual(wrongresult)
            expect(result).toEqual(expectresult)
        })
    })
    describe('getRegressiveTaxAmount testing', () => {
        it('should pass with balance > higher bracket', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.class_reg_brackets[0] = brackets.data[1]
            const expectresult = (instance.state.class_reg_brackets[0].higher_bracket - instance.state.class_reg_brackets[0].lower_bracket) * (instance.state.class_reg_brackets[0].percentage/100)
            const wrongresult = (15 - instance.state.class_reg_brackets[0].lower_bracket) * (instance.state.class_reg_brackets[0].percentage/100)
            const result = instance.getRegressiveTaxAmount(15)
            expect(result).not.toEqual(wrongresult)
            expect(result).toEqual(expectresult)
        })
        it('should pass with balance < higher bracket', () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            instance.state.class_reg_brackets[0] = brackets.data[1]
            const wrongresult = (instance.state.class_reg_brackets[0].higher_bracket - instance.state.class_reg_brackets[0].lower_bracket) * (instance.state.class_reg_brackets[0].percentage/100)
            const expectresult = (10 - instance.state.class_reg_brackets[0].lower_bracket) * (instance.state.class_reg_brackets[0].percentage/100)
            const result = instance.getRegressiveTaxAmount(10)
            expect(result).not.toEqual(wrongresult)
            expect(result).toEqual(expectresult)
        })
    })
    describe('importTaxes testing', () => {
        it('should pass', async () => {
            const instance = wrapper.instance()
            const brackets = mockBracketData()
            const classrooms = mockClassroomData()
            const classroom_response = {data: [classrooms.data[1]]}
            const taxes = mockTaxData()
            instance.state.class_code = "classb"
            instance.state.tax_import_class_code = "classa"
            instance.state.tax_import_taxes.id = "taxid"

            const prog_response = {data: [{
                id: "bracketid", tax_id: "2taxid", lower_bracket: 1, higher_bracket: 10, percentage: 10
            }]}
            const reg_response = {data: [{
                id: "2bracketid", tax_id: "2taxid", lower_bracket: 1, higher_bracket: 12, percentage: 15
            }]}
            const tax_response = {data: [{
                id: "3taxid", class_code: "classb", sales_tax: 16, percentage_tax: 8, flat_tax: 20
            }]}

            axios.get.mockImplementationOnce(() => Promise.resolve(classroom_response))
            axios.get.mockImplementationOnce(() => Promise.resolve(taxes))
            axios.get.mockImplementationOnce(() => Promise.resolve(prog_response))
            axios.get.mockImplementationOnce(() => Promise.resolve(reg_response))
            axios.get.mockImplementationOnce(() => Promise.resolve(tax_response))
            axios.post.mockImplementationOnce(() => Promise.resolve(tax_response))
            axios.post.mockImplementationOnce(() => Promise.resolve())
            axios.post.mockImplementationOnce(() => Promise.resolve())

            await instance.importTaxes()
            expect(axios.get).toHaveBeenCalledTimes(7)
            expect(axios.post).toHaveBeenCalledTimes(3)
            expect(instance.state.class_tax).toEqual(tax_response.data[0])

        });
    })
    describe('createTaxesModal testing', () => {
        it('should render createTaxesModal modal but not show', () => {
            const instance = wrapper.instance()
            expect(instance.createTaxesModal()).toMatchSnapshot();
        });
        it('should render createTaxesModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.showCreateTaxes = true
            expect(instance.createTaxesModal()).toMatchSnapshot();
        });
    })
    describe('renderUpdateEasyTax testing', () => {
        it('should render renderUpdateEasyTax modal with flat tax or percentage tax', () => {
            const instance = wrapper.instance()
            instance.state.current_tax_type = "Flat Tax"
            expect(instance.renderUpdateEasyTax()).toMatchSnapshot();
        });
        it('should render renderUpdateEasyTax modal progressive tax', () => {
            const instance = wrapper.instance()
            instance.state.current_tax_type = "Progressive Tax"
            expect(instance.renderUpdateEasyTax()).toMatchSnapshot();
        });
        it('should render renderUpdateEasyTax modal regressive tax', () => {
            const instance = wrapper.instance()
            instance.state.current_tax_type = "Regressive Tax"
            expect(instance.renderUpdateEasyTax()).toMatchSnapshot();
        });
    })
    describe('importTaxModal testing', () => {
        it('should render importTaxModal modal but not show', () => {
            const instance = wrapper.instance()
            expect(instance.importTaxModal()).toMatchSnapshot();
        });
        it('should render importTaxModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.showImportTaxes = true
            expect(instance.importTaxModal()).toMatchSnapshot();
        });
    })

})

const mockStudentData = jest.fn(() => {
    return {
        data: [
            {id: "studentid", name: "studentname", class_code: "classc", balance: 10}, 
            {id: "2studentid", name: "2studentname", class_code: "classc", balance: 20}
        ],
    };
});

const mockTaxData = jest.fn(() => {
    return {
        data: [
            {id: "taxid", class_code: "classc", sales_tax: 10, percentage_tax: 5, flat_tax: 15},
            {id: "2taxid", class_code: "classa", sales_tax: 16, percentage_tax: 8, flat_tax: 20},
        ]
    }
})

const mockBracketData = jest.fn(() => {
    return {
        data: [
            {id: "bracketid", tax_id: "taxid", lower_bracket: 1, higher_bracket: 10, percentage: 10},
            {id: "2bracketid", tax_id: "taxid", lower_bracket: 1, higher_bracket: 12, percentage: 15}
        ]
    }
})

const mockClassroomData = jest.fn(() => {
    return {
        data: [
            {id: "class1", class_name: "classname", teacher_id: 1, class_code: "classc"}, 
            {id: "class2", class_name: "2classname", teacher_id: 2, class_code: "classa"}],
    };
});




//fields = ['id', 'class_code', 'sales_tax', 'percentage_tax', 'flat_tax']
//fields = ['id', 'tax_id', 'lower_bracket', 'higher_bracket', 'percentage']
//fields = ['id', 'tax_id', 'lower_bracket', 'higher_bracket', 'percentage']