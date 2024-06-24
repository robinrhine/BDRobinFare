const MiniRuleController = require('../Controllers/Mini_Rule_Controller');
const {onCreateMiniRulePayloadData}  = require('../Utility/Payloads/Mini_Rule');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const SearchMiniRule =(req,res)=>{

    let qObj ={};
            
    qObj.traceId     = req.body.traceId;  
    qObj.offerId     = req.body.offerId; 
    
    
    
    if(qObj.traceId !=="" && qObj.offerId !==""){
        qObj.Payload      = onCreateMiniRulePayloadData(qObj);
    }

    
    console.log(JSON.stringify(qObj.Payload));


    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("mini_rules");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("mini_rules");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const oMiniRule = new MiniRuleController (qObj);

    
    oMiniRule.onRetrieveApisDataForMiniRule().then(result =>
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

module.exports={SearchMiniRule};