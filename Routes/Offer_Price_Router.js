const OfferPriceController = require('../Controllers/Offer_Price_Controller');
const {onCreatePayloadDataForOfferPirce}  = require('../Utility/Payloads/Offer_Price');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OfferPriceInputs =(req,res)=>{

    let qObj ={};
            
    qObj.traceId   = req.body.traceId;  
    qObj.offerId   = req.body.offerId; 
    console.log(qObj.offerId);
    

    if(qObj.traceId !== "" && qObj.offerId.length > 0){
        qObj.Payload      = onCreatePayloadDataForOfferPirce(qObj);
    }

    //qObj.Payload      = onCreatePayloadData(qObj);
    console.log(JSON.stringify(qObj.Payload));


    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("offer_price");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("offer_price");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const offerPrice = new OfferPriceController(qObj);
    offerPrice.onRetrieveApisDataForOfferPrice().then(result =>
    {
                if(result.status === 200)
                {
                    
                    res.status(200).json({success:true,TraceId:result.traceId,Results:result.data});

                }else{
                   
                    res.status(500).json({
                        success:false,
                        errorMessage:result.statusText
                    });
                }

    });
    
}

module.exports={OfferPriceInputs};