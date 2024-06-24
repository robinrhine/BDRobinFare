const MiniRuleController = require('../Api_Calls/BDFareMiniRule');
const s ={};
module.exports =s.fareRuleController = class{

    constructor(qObj){
    
        this.MiniRule = new MiniRuleController(qObj);
        
    }

   async onRetrieveApisDataForMiniRule()
   {
        let {status,statusText,data} = await this.MiniRule.RetrieveMiniRule();
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