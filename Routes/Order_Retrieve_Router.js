const OrderRetrieveController = require('../Controllers/Order_Retrieve_Controller');
const {onCreatePayloadDataForOrderRetrieve}  = require('../Utility/Payloads/Order_Retrieve');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OrderRetrieveInputs =(req,res)=>{

    let qObj ={};
            
    qObj.orderReference   = req.body.orderReference;  
    

    if(qObj.orderReference  !== ""){
        qObj.Payload      = onCreatePayloadDataForOrderRetrieve(qObj);
    }

    //qObj.Payload      = onCreatePayloadData(qObj);
    console.log(JSON.stringify(qObj.Payload));


    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_retrieve");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_retrieve");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const orderRetrieve = new OrderRetrieveController(qObj);
    orderRetrieve.onRetrieveApisDataForOrderRetrieve().then(result =>
    {
                if(result.status === 200)
                {
                    
                    res.status(200).json({success:true,Results:result.data});

                }else{
                   
                    res.status(500).json({
                        success:false,
                        errorMessage:result.statusText
                    });
                }

    });
    
}

module.exports={OrderRetrieveInputs};