const OrderReshopPriceController = require('../Controllers/Order_ReshopPrice_Controller');
const {onCreatePayloadDataForOrderReshopPrice}  = require('../Utility/Payloads/Order_ReshopPrice');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OrderReshopPriceInputs =(req,res)=>{

    let qObj ={};
            
    qObj.orderReference   = req.body.orderReference;  
    

    if(qObj.orderReference  !== ""){
        qObj.Payload      = onCreatePayloadDataForOrderReshopPrice(qObj);
    }

    //qObj.Payload      = onCreatePayloadData(qObj);
    console.log(JSON.stringify(qObj.Payload));


    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_reshop_price");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("order_reshop_price");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const orderReshop = new OrderReshopPriceController(qObj);
    orderReshop.onRetrieveApisDataForOrderReshopPrice().then(result =>
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

module.exports={OrderReshopPriceInputs};