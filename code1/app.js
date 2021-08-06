const express = require("express");
const app = express();
const MasterSaga = require('./MasterSaga');
const dbConnection  = require('./DBconnection');

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

      let axiosConfig1 = {
        auth: {
            username: 'abc',
            password: '1234'
          }
      }; 
    let promise =  MasterSaga.callGetAPI("https://madeup.typeone.com/products?next=50",axiosConfig);  //Fetch data
    let promise1 = MasterSaga.callGetAPI("https://madeup.typetwo.com/products?next=50",axiosConfig1); // Fetch data

    let parentData = promise;
    let optionData = promise1;
    let finalArr = [];
    let finalParentCollection = [];
    let finalChildCollection = [];

    for(let p in parentData) {
        for(let c in parentData[p].children) {
            let parentObj = {
                "sku": parentData.name.replaceAll(" ","_"),
                "name": parentData.name,
                "description": parentData.description,
                "linkpoints": [
                    {
                        "name": parentData.childrenLinkPoint[p][c].name,
                        "child_skus": parentData.children.filter((c)=>c.namereplaceAll(" ","_"))
    
                    }
                ]
            };

            let childObj = [
                {
                    "sku": parentData.children[p][c].name.replaceAll(" ","_"),
                    "name": parentData.children[p][c].name,
                    "description": parentData.children[p][c].description,
                    "link": {
                        "name": parentData.childrenLinkPoint[p].name,
                        "value": optionData.options[0].optionValues,
                        "parentSku": parentData.name.replaceAll(" ","_")
                    }
                }
            ];

            let obj = {
                "parent": parentObj,
                "children": childObj
            }
        }
        finalArr.push(obj);
        finalParentCollection.push(parentObj);
        finalChildCollection.push(childObj);
    }
    dbConnection.mongoConnection("parentCollection",parentObj);         // Store parent data into parent collection
    dbConnection.mongoConnection("childCollection",childObj);           // Store child data into child collection
    let postFinalData = MasterSaga.callPostAPI("https://madeup.typeboss.com/products",finalArr); // Post data
    console.log(postFinalData);
});
