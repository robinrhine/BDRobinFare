'use strict'
const { json } = require('express');
const fetch = require('node-fetch');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}


const internal = {};

module.exports = internal.BDFareController = class {
  constructor(qs){
    console.log('Initialize BDFare Order ReshopPrice object');
    this.QS =qs;
    this.secrect_key = qs.secrect_key;
    this.apiURL = qs.apiURL;
    this.payload= qs.Payload;

    
    

  }
  pubMethod(x){
    
    return this.apiURL;
    //return this.airlinesReturnData ;
  }

  async  OrderReshopPrice() 
  {
            
            let {status,statusText,data} = await _onCallBDFareAPIForOrderReshopPrice(this.apiURL,this.payload,this.secrect_key);
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
                    data:data.OrderReshopResponse
                    
                  }
            }
            
    }
}






async function _onCallBDFareAPIForOrderReshopPrice (apiURL,payload,apiKey)
{
  
    console.log("------------0-----------");
    console.log(JSON.stringify(payload));
    console.log("------------1-----------");
    console.log(apiURL);
    console.log("------------2-----------");
    console.log(apiKey);
    
    
    let oReturn ={};
    let res ="";
    try{
          res = await fetch(apiURL, {
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

            if(Responsedata.statusCode === 'OK' && Responsedata.success === true && Responsedata.error === null){
              oReturn.status=200;
              oReturn.statusText="success";
              oReturn.data={OrderReshopResponse : Responsedata.response};
              return oReturn;
            }else if(Responsedata.error !== null){
              oReturn.status=500;
              oReturn.statusText=Responsedata.error.errorMessage;
              oReturn.data={};
            
              
              return oReturn;
            }
              
        }else{
          //throw Error('Custom errror');
          console.log(Responsedata);
          oReturn.status=500;
          oReturn.statusText=Responsedata.error.errorMessage;
          oReturn.data={};
          return oReturn;
        }
}catch(err){

  let or = await res.json();
  oReturn.status=500;
  oReturn.statusText= or.message;
  oReturn.data={};
  return oReturn;
}
  
}