const OrderCancelController = require('../Controllers/Order_Cancel_Controller');
const {onCreatePayloadDataForOrderCancel}  = require('../Utility/Payloads/Order_Cancel');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OrderCancelInputs =(req,res)=>{

    let qObj ={};
            
    qObj.orderReference   = req.body.orderReference;  
    

    if(qObj.orderReference  !== ""){
        qObj.Payload      = onCreatePayloadDataForOrderCancel(qObj);
    }

    //qObj.Payload      = onCreatePayloadData(qObj);
    console.log(JSON.stringify(qObj.Payload));


    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_cancel");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_cancel");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const orderCancel = new OrderCancelController(qObj);
    orderCancel.onRetrieveApisDataForOrderCancel().then(result =>
    {
                if(result.status === 200)
                {
                    
                    res.status(200).json({success:true,OrderReference:result.orderReference,PaymentTimeLimit:result.paymentTimeLimit,OrderItemList:result.data});

                }else{
                   
                    res.status(500).json({
                        success:false,
                        errorMessage:result.statusText
                    });
                }

    });
    
}

module.exports={OrderCancelInputs};