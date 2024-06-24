'use strict'
const { json } = require('express');
const fetch = require('node-fetch');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}


const internal = {};

module.exports = internal.BDFareController = class {
  constructor(qs){
    console.log('Initialize BDFareRule object');
    this.QS =qs;
    this.secrect_key = qs.secrect_key;
    this.apiURL = qs.apiURL;
    this.payload= qs.Payload;

    
    

  }
  pubMethod(x){
    
    return this.apiURL;
    //return this.airlinesReturnData ;
  }

  async  RetrieveFareRules() 
  {
            
            let {status,statusText,data} = await _onCallBDFareAPIForFareRules(this.apiURL,this.payload,this.secrect_key);
            if(status === 500)
            {
              
              return {
                status: 500,
                statusText:statusText
              }

            }else{
                return {
                    status:200,
                    statusText:'success',
                    data:data.FareRules
                    
                  }
            }
            
    }
}






async function _onCallBDFareAPIForFareRules (apiURL,payload,apiKey)
{
  
    console.log("------------0-----------");
    console.log(JSON.stringify(payload));
    console.log("------------1-----------");
    console.log(apiURL);
    console.log("------------2-----------");
    console.log(apiKey);
    
    
    let oReturn ={};
    const res = await fetch(apiURL, {
    method: 'POST',
    headers: {
    'accept': 'text/plain',
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
    },
    body:JSON.stringify(payload)
  
  });



  if(res.ok)  // if successfull.
    {
    
      const Responsedata = await res.json();
      console.log(Responsedata);

      if(Responsedata.statusCode === 'OK' && Responsedata.success === true && Responsedata.response.error === null){
        oReturn.status=200;
        oReturn.statusText="success";
        oReturn.data={FareRules : Responsedata.response.fareRuleRouteInfos};
        return oReturn;
      }else if(Responsedata.response.error !== null){
        oReturn.status=500;
        oReturn.statusText=Responsedata.response.error.errorMessage;
        oReturn.data={};
      
        
        return oReturn;
      }
        
  }else{
    //throw Error('Custom errror');
    oReturn.status=500;
    oReturn.statusText="BDFare Fare Rules Api can't reurn data due to some problem";
    oReturn.data={};
    return oReturn;
  }
  
}







