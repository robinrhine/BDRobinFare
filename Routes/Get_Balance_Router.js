const GetBalanceController = require('../Controllers/Get_Balance_Controller');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const SearchBalance =(req,res)=>{

    let qObj ={};
            
    
    

    if(process.env.NODE_ENV !=="PROD"){
        qObj.secrect_key = process.env.DEV_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("get_balance");
        qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
    }else{
        qObj.secrect_key = process.env.PROD_API_KEY;
        qObj.api_endPoint = onRetrieveEndPoints("get_balance");
        qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
    }
    
    

    const oFareBalance = new GetBalanceController(qObj);

    /// need to work from here .................
    oFareBalance.onRetrieveApisDataForGetBalance().then(result =>
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

module.exports={SearchBalance};