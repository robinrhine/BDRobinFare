const OrderChangeController = require('../Controllers/Order_Change_Controller');
const {onCreatePayloadDataForOrderChange}  = require('../Utility/Payloads/Order_Change');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OrderChangeInputs =(req,res)=>{

    let qObj ={};
            
    qObj.orderReference   = req.body.orderReference;
    qObj.issueTicketViaPartialPayment = req.body.issueTicketViaPartialPayment;  
    
    console.log(qObj.orderReference);
    console.log(qObj.issueTicketViaPartialPayment);

    if(qObj.orderReference  !== ""){
        qObj.Payload      = onCreatePayloadDataForOrderChange(qObj);
    }

    //qObj.Payload      = onCreatePayloadData(qObj);
    console.log(JSON.stringify(qObj.Payload));


    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_change");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_change");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const orderChange = new OrderChangeController(qObj);
    orderChange.onRetrieveApisDataForOrderChange().then(result =>
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

module.exports={OrderChangeInputs};