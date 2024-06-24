const OrderSellController = require('../Controllers/Order_Sell_Controller');
const {onCreatePayloadDataForOrderSell}  = require('../Utility/Payloads/Order_Sell');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OrderSellInputs =(req,res)=>{

    let qObj ={};
            
    qObj.traceId   = req.body.traceId;  
    qObj.offerId   = req.body.offerId;
    qObj.contactInfo = req.body.contactInfo;
    qObj.passengerList = req.body.passengerList; 
    

    if(qObj.traceId !== "" && qObj.offerId.length > 0){
         onCreatePayloadDataForOrderSell(qObj).then(r =>{

            qObj.Payload = r;
            //res.status(200).json({Payload:qObj.Payload});
            if(process.env.NODE_ENV !=="PROD"){
                qObj.secrect_key = process.env.DEV_API_KEY;
                qObj.api_endPoint = onRetrieveEndPoints("order_sell");
                qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
            }else{
                qObj.secrect_key = process.env.PROD_API_KEY;
                qObj.api_endPoint = onRetrieveEndPoints("order_sell");
                qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
            }

            const orderSell = new OrderSellController(qObj);
            orderSell.onRetrieveApisDataForOrderSell().then(result =>
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


        });
    }

    
    
}

module.exports={OrderSellInputs};