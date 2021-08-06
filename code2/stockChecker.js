const express = require("express");
const app = express();
const MasterSaga = require('./MasterSaga');
const dbConnection = require('./DBconnection');

app.use(express.json());
app.use(express.urlencoded());
const port = 1355;

app.get("/getData", (req, res) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": "Bearer abc9456",
        }
    };
    2
    let axiosConfig1 = {
        auth: {
            username: 'abc',
            password: '1234'
        }
    };
    let promise = MasterSaga.callGetAPI("https://madeup.typeone.com/update?next=50", axiosConfig);  //Fetch data
    let promise1 = MasterSaga.callGetAPI("https://madeup.typetwo.com/update?next=50", axiosConfig1); // Fetch data

    let defaultQty = dbConnection.mongoFindConnection("settings", "");

    let inventorData1 = promise;
    let finalArr = [];

    for (let i in inventorData1) {
        let inventorData2 = promise1.filter((i) => i.sku == inventorData1[i].sku);
        let obj = {
            "sku": inventorData1[i].sku,
            "price": inventorData1[i].price,
            "source": inventorData1[i].inventory.filter((i) => i.name == "Default"),
            "extended_field": {
                "stock_update": {
                    "qty": inventorData2.update.stock.isManaged
                        ? inventorData2.update.stock.qty
                        : defaultQty.default_stock_value
                }
            },
            "custom_field": {
                "attribute_code": inventorData1[i].status,
                "attribute_value": "1"  // Taking 1 as default because not getting exact requirement
            }
        }
        finalArr.push(obj);
    }

    let finalObj  = {
        "products" : finalArr
    }

    dbConnection.mongoConnection("inventoryCollection",finalArr);         // Store data into inventory collection
    let postFinalData = MasterSaga.callPostAPI("https://madeup.typeboss.com/products_update",finalObj); // Post data
    console.log(postFinalData);
});
