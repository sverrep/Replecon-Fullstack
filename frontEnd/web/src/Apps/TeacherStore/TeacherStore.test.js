import React from 'react';
import TeacherStore from './TeacherStore.js'
import axios from 'axios'
jest.mock('axios');
let wrapper

describe('TeacherStore Testing', () => {
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
        wrapper = shallow(<TeacherStore.WrappedComponent {...props} />, { disableLifecycleMethods: true })
    })
    describe('componentMount testing', () => {
        it('should call the right functions', async () => {
            const instance = wrapper.instance()

            instance.getShops = jest.fn()

            await instance.componentDidMount()

            expect(instance.getShops).toHaveBeenCalledTimes(1)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const shops = mockShopData()
            const items = mockItemData()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.componentDidMount()
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(instance.state.shops).toEqual(shops.data)
            expect(instance.state.classHasShop).toBe(true)
            expect(instance.state.store_name).toEqual(shops.data[0].shop_name)
            expect(instance.state.shop_id).toEqual(shops.data[0].id)
            expect(instance.state.items).toHaveLength(2)
            expect(instance.state.items).toEqual([items.data[0], items.data[1]])
        });   
    })
    describe('getShop testing', () => {
        it('should call the right function after passing axios', async () => {
            const instance = wrapper.instance()
            instance.checkForShop = jest.fn()
            const shops = mockShopData()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))

            await instance.getShops()
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//shops/')
            expect(instance.state.shops).toEqual(shops.data)
            expect(instance.checkForShop).toHaveBeenCalledTimes(1)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const shops = mockShopData()
            const items = mockItemData()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getShops()
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(instance.state.shops).toEqual(shops.data)
            expect(instance.state.classHasShop).toBe(true)
            expect(instance.state.store_name).toEqual(shops.data[0].shop_name)
            expect(instance.state.shop_id).toEqual(shops.data[0].id)
            expect(instance.state.items).toHaveLength(2)
            expect(instance.state.items).toEqual([items.data[0], items.data[1]])
        });   
    })
    describe('checkForShop testing', () => {
        it('should find no shop for class', async () => {
            const instance = wrapper.instance()
            instance.getItems = jest.fn()
            const shops = mockShopData()
            shops.data[0].class_code = "classa"

            await instance.checkForShop(shops.data)
            expect(instance.state.classHasShop).toEqual(false)
            expect(instance.state.store_name).toEqual("")
            expect(instance.state.shop_id).toEqual(0)
            expect(instance.getItems).toHaveBeenCalledTimes(1)
        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const shops = mockShopData()
            const items = mockItemData()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.checkForShop(shops.data)
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(instance.state.classHasShop).toBe(true)
            expect(instance.state.store_name).toEqual(shops.data[0].shop_name)
            expect(instance.state.shop_id).toEqual(shops.data[0].id)
            expect(instance.state.items).toHaveLength(2)
            expect(instance.state.items).toEqual([items.data[0], items.data[1]])
        });   
    })
    describe('importHasShop testing', () => {
        it('should return false', async () => {
            const instance = wrapper.instance()
            const shops = mockShopData()
            instance.state.item_import_class_code = "classb"

            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))

            expect(await instance.importHasShop()).toBe(false)
        });

        it('should return true', async () => {
            const instance = wrapper.instance()
            const shops = mockShopData()
            const items = mockItemData()
            instance.state.item_import_class_code = "classa"

            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            expect(await instance.importHasShop()).toBe(true)
            expect(axios.get).toHaveBeenCalledTimes(2)
            expect(instance.state.item_import_list).toHaveLength(1)
            expect(instance.state.item_import_list).toEqual([items.data[2]])
        });   
    })
    describe('getItems testing', () => {
        it('should call getShopItems', async () => {
            const instance = wrapper.instance()
            const items = mockItemData()
            instance.getShopItems = jest.fn()

            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getItems("local")
            expect(instance.getShopItems).toHaveBeenCalledTimes(1)
            expect(instance.getShopItems).toHaveBeenCalledWith(items.data, "local")

        });

        it('should pass', async () => {
            const instance = wrapper.instance()
            const items = mockItemData()
            instance.state.shop_id = "shopid"

            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))

            await instance.getItems("local")
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//items/')
            expect(instance.state.items).toHaveLength(2)
            expect(instance.state.items).toEqual([items.data[0], items.data[1]])
        });   
    })
    describe('getShopItems testing', () => {
        it('should set items with type local', () => {
            const instance = wrapper.instance()
            const items = mockItemData()
            instance.state.shop_id = "shopid"

            instance.getShopItems(items.data, "local")
            expect(instance.state.items).toHaveLength(2)
            expect(instance.state.items).toEqual([items.data[0], items.data[1]])

        });

        it('should set item_import_list with type import', async () => {
            const instance = wrapper.instance()
            const items = mockItemData()
            instance.state.item_import_store.id = "2shopid"

            await instance.getShopItems(items.data, "import")
            expect(instance.state.items).toHaveLength(0)
            expect(instance.state.item_import_list).toHaveLength(1)
            expect(instance.state.item_import_list).toEqual([items.data[2]])
        });   
    })
    describe('createNewStore testing', () => {
        it('should fail validation', () => {
            const instance = wrapper.instance()
            instance.createNewStore()
            expect(instance.state.store_error).toEqual("Please enter a valid store name")
        });

        it('should pass and set correct states', async () => {
            const instance = wrapper.instance()
            instance.state.store_name = "shopname"
            instance.state.showCreateStore = true
            const shopresponse = {data: {id: "shopid"}}

            axios.post.mockImplementationOnce(() =>  Promise.resolve(shopresponse))

            await instance.createNewStore()
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith(
                'https://mythical-mason-324813.ey.r.appspot.com//shops/', 
                {
                    shop_name: "shopname", 
                    class_code: "classc"
                }
            )
            expect(instance.state.showCreateStore).toBe(false)
            expect(instance.state.classHasShop).toBe(true)
            expect(instance.state.shop_id).toEqual("shopid")
        });   
    })
    describe('addItem testing', () => {
        it('should fail validation', () => {
            const instance = wrapper.instance()
            instance.validateItem = jest.fn()
            instance.validateItem.mockReturnValueOnce(false)
            instance.addItem()
            expect(axios.post).toHaveBeenCalledTimes(0)
        });

        it('should pass and set correct states', async () => {
            const instance = wrapper.instance()
            instance.state.item_name = "itemname"
            instance.state.item_desc = "description"
            instance.state.item_price = 10
            instance.state.shop_id = "shopid"
            instance.state.showAddItem = true
            const shopresponse = {data: 
                {
                    item_name: "itemname",
                    description: "description",
                    price: 10,
                    shop_id: "shopid",
            }}
            axios.post.mockImplementationOnce(() =>  Promise.resolve(shopresponse))

            await instance.addItem()
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.post).toHaveBeenCalledWith(
                'https://mythical-mason-324813.ey.r.appspot.com//items/', 
                {
                    item_name: "itemname",
                    description: "description",
                    price: 10,
                    shop_id: "shopid",
                }
            )
            expect(instance.state.showAddItem).toBe(false)
            expect(instance.state.items).toHaveLength(1)
            expect(instance.state.items).toEqual([{
                item_name: "itemname",
                description: "description",
                price: 10,
                shop_id: "shopid",
            }])
        });   
    })
    describe('updateItem testing', () => {
        it('should fail validation', () => {
            const instance = wrapper.instance()
            instance.validateItem = jest.fn()
            instance.validateItem.mockReturnValueOnce(false)
            instance.updateItem()
            expect(axios.post).toHaveBeenCalledTimes(0)
        });

        it('should pass and set correct states', async () => {
            const instance = wrapper.instance()
            instance.state.item_name = "13"
            instance.state.item_desc = "14"
            instance.state.item_price = "11"
            instance.state.shop_id = "shopid"
            instance.state.item_id = "itemid"
            instance.state.showUpdateItem = true
            const shopresponse = {data: 
                [{
                    id: "itemid",
                    item_name: "13",
                    description: "14",
                    price: "11",
                    shop_id: "shopid",
            }]}
            axios.put.mockImplementationOnce(() =>  Promise.resolve())
            axios.get.mockImplementationOnce(() =>  Promise.resolve(shopresponse))

            await instance.updateItem()
            expect(axios.put).toHaveBeenCalledTimes(1)
            expect(axios.put).toHaveBeenCalledWith(
                'https://mythical-mason-324813.ey.r.appspot.com//items/itemid', 
                {
                    item_name: "13",
                    description: "14",
                    price: "11",
                    shop_id: "shopid",
                }
            )
            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//items/')
            expect(instance.state.showUpdateItem).toBe(false)
            expect(instance.state.items).toHaveLength(1)
            expect(instance.state.items).toEqual(shopresponse.data)
        });   
    })
    describe('storeClickedItem testing', () => {
        it('should set states correctly', () => {
            const instance = wrapper.instance()

            instance.storeClickedItem("itemname", "itemprice", "itemdesc", "itemid")
            expect(instance.state.showUpdateItem).toBe(true)
            expect(instance.state.item_name).toEqual("itemname")
            expect(instance.state.item_price).toEqual("itemprice")
            expect(instance.state.item_desc).toEqual("itemdesc")
            expect(instance.state.item_id).toEqual("itemid")

        });
    })
    describe('deleteItem testing', () => {

        it('should delete item', async () => {
            const instance = wrapper.instance()
            instance.state.item_id = "itemid"
            instance.state.showUpdateItem = true
            instance.getItems = jest.fn()
            const items = mockItemData()
            instance.state.items = items.data

            axios.delete.mockImplementationOnce(() =>  Promise.resolve())

            await instance.deleteItem()
            expect(axios.delete).toHaveBeenCalledTimes(1)
            expect(axios.delete).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//items/itemid')
            expect(instance.state.showUpdateItem).toBe(false)
            expect(instance.state.items).toEqual([])
        });   
    })
    describe('importStoreItems testing', () => {
        it('should pass and set correct states', async () => {
            const instance = wrapper.instance()
            const classrooms = mockClassroomData()
            const shops = mockShopData()
            const items = mockItemData()
            instance.state.item_import_class_code = "classa"
            instance.state.showImportItems = true
            instance.state.shop_id = "shopid"
            const result = {data: {id: "1", item_name: "3itemname", item_description: "3itemdesc", item_price: "3itemprice", shop_id: "shopid"}}
            
            axios.get.mockImplementationOnce(() =>  Promise.resolve(classrooms))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(shops))
            axios.get.mockImplementationOnce(() =>  Promise.resolve(items))
            axios.post.mockImplementationOnce(() => Promise.resolve(result))

            await instance.importStoreItems()
            expect(axios.get).toHaveBeenCalledTimes(3)
            expect(axios.post).toHaveBeenCalledTimes(1)
            expect(axios.get).toHaveBeenCalledWith('https://mythical-mason-324813.ey.r.appspot.com//classrooms/')
            expect(axios.get).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//shops/")
            expect(axios.get).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//items/")
            expect(axios.post).toHaveBeenCalledWith("https://mythical-mason-324813.ey.r.appspot.com//items/",         
                {description: "3itemdesc",
                item_name: "3itemname",
                price: "3itemprice",
                shop_id: "shopid",
              })
            expect(instance.state.showImportItems).toBe(false)
            expect(instance.state.items).toEqual([result.data])
        });   
    })
    describe('renderStoreItems testing', () => {
        it('should display single row', () => {
            const instance = wrapper.instance()
            expect(instance.renderStoreItems()).toMatchSnapshot();
        });
    })
    describe('renderStoreCards testing', () => {
        it('should display cards properly', () => {
            const instance = wrapper.instance()
            const item = {item_name: "itemname", price: 10, description: "itemdesc"}
            expect(instance.renderStoreCards(item)).toMatchSnapshot();
        });
    })
    describe('hasShop testing', () => {
        it('should render hasShop view', () => {
            const instance = wrapper.instance()

            instance.state.store_name = "Test"

            expect(instance.hasShop()).toMatchSnapshot();
        });
    })
    describe('hasNoShop testing', () => {
        it('should render hasNoShop view', () => {
            const instance = wrapper.instance()

            expect(instance.hasNoShop()).toMatchSnapshot();
        });
    })
    describe('renderShopView testing', () => {
        it('should call hasShop view', () => {
            const instance = wrapper.instance()
            instance.hasShop = jest.fn()
            instance.hasNoShop = jest.fn()
            instance.state.classHasShop = true
            instance.renderShopView()
            expect(instance.hasShop).toHaveBeenCalledTimes(1)
            expect(instance.hasNoShop).toHaveBeenCalledTimes(0)
            
        });
        it('should call hasNoShop view', () => {
            const instance = wrapper.instance()
            instance.hasShop = jest.fn()
            instance.hasNoShop = jest.fn()

            instance.renderShopView()
            expect(instance.hasShop).toHaveBeenCalledTimes(0)
            expect(instance.hasNoShop).toHaveBeenCalledTimes(1)
        });
    })
    describe('validateItem testing', () => {
        it('should not pass first condition with empty item name', () =>{
            const instance = wrapper.instance()
            instance.state.item_name = ""
            instance.validateItem()
            expect(instance.state.store_error).toEqual("Please enter a valid item name")
        })
        it('should not pass second condition with non number price', () =>{
            const instance = wrapper.instance()
            instance.state.item_name = "itemname"
            instance.state.item_price = "yo"
            instance.validateItem()
            expect(instance.state.store_error).toEqual("Please enter a number")
        })
        it('should not pass third condition with price lower than 0', () =>{
            const instance = wrapper.instance()
            instance.state.item_name = "itemname"
            instance.state.item_price = "-10"
            instance.validateItem()
            expect(instance.state.store_error).toEqual("Please enter a valid item price")
        })
        it('should not pass third condition with price lower than 0', () =>{
            const instance = wrapper.instance()
            instance.state.item_name = "itemname"
            instance.state.item_price = "10"
            instance.state.item_desc = ""
            instance.validateItem()
            expect(instance.state.store_error).toEqual("Please enter a valid item description")
        })
        it('should pass', () =>{
            const instance = wrapper.instance()
            instance.state.item_name = "itemname"
            instance.state.item_price = "10"
            instance.state.item_desc = "itemdesc"
            expect(instance.validateItem()).toBe(true)
            expect(instance.state.store_error).toEqual("")
        })
    })
    describe('createStoreModal testing', () => {
        it('should render createStoreModal modal but not show', () => {
            const instance = wrapper.instance()
            expect(instance.createStoreModal()).toMatchSnapshot();
        });
        it('should render createStoreModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.showCreateStore = true
            expect(instance.createStoreModal()).toMatchSnapshot();
        });
    })
    describe('addItemModal testing', () => {
        it('should render addItemModal modal but not show', () => {
            const instance = wrapper.instance()
            expect(instance.addItemModal()).toMatchSnapshot();
        });
        it('should render addItemModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.showAddItem = true
            expect(instance.addItemModal()).toMatchSnapshot();
        });
    })
    describe('updateItemModal testing', () => {
        it('should render updateItemModal modal but not show', () => {
            const instance = wrapper.instance()
            instance.state.item_name = "itemname"
            instance.state.item_price = 10
            instance.state.item_desc = "itemdesc"
            expect(instance.updateItemModal()).toMatchSnapshot();
        });
        it('should render updateItemModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.showUpdateItem = true
            instance.state.item_name = "itemname"
            instance.state.item_price = 10
            instance.state.item_desc = "itemdesc"
            expect(instance.updateItemModal()).toMatchSnapshot();
        });
    })
    describe('importStoreItemsModal testing', () => {
        it('should render importStoreItemsModal modal but not show', () => {
            const instance = wrapper.instance()
            expect(instance.importStoreItemsModal()).toMatchSnapshot();
        });
        it('should render importStoreItemsModal modal and show', () => {
            const instance = wrapper.instance()
            instance.state.showImportItems = true
            expect(instance.importStoreItemsModal()).toMatchSnapshot();
        });
    })
    describe('render testing', () => {
        it('should render default components', () => {
            expect(wrapper.getElements()).toMatchSnapshot();
        })
    })
})

const mockShopData = jest.fn(() => {
    return {
        data: [
            {id: "shopid", shop_name: "shopname", class_code: "classc"}, 
            {id: "2shopid", shop_name: "2shopname", class_code: "classa"}],
    };
});

const mockItemData = jest.fn(() => {
    return {
        data: [
            {id: "itemid", item_name: "itemname", description: "itemdesc", price: "itemprice", shop_id: "shopid"},
            {id: "2itemid", item_name: "2itemname", description: "2itemdesc", price: "2itemprice", shop_id: "shopid"},
            {id: "3itemid", item_name: "3itemname", description: "3itemdesc", price: "3itemprice", shop_id: "2shopid"}
        ]
    };
});

const mockClassroomData = jest.fn(() => {
    return {
        data: [
            {id: "class1", class_name: "classname", teacher_id: 1, class_code: "classc"}, 
            {id: "class2", class_name: "2classname", teacher_id: 2, class_code: "classa"}],
    };
});

//fields = ['id', 'shop_name', 'class_code']
//fields = ['id', 'class_name', 'teacher_id', 'class_code']