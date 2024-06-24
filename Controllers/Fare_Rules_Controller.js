const BDFareRulesController = require('../Api_Calls/BDFareRules');
const s ={};
module.exports =s.fareRuleController = class{

    constructor(qObj){
    
        this.BDFareRule = new BDFareRulesController(qObj);
        
    }

   async onRetrieveApisDataForFareRules()
   {
        let {status,statusText,data} = await this.BDFareRule.RetrieveFareRules();
        console.log(data);
        if(status === 200)
        {
      
                return {
                    status:200,
                    statusText:'success',
                    data:data
                }
        }else{
            return {
                status:500,
                statusText:statusText
            }
        }


        
    }
}
