const OrderChangeController = require('../Api_Calls/BDFareOrderChange');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOrderChange = new OrderChangeController(qObj);
        
    }

   async onRetrieveApisDataForOrderChange()
   {
        let {status,statusText,data} = await this.BDFareOrderChange.OrderChange();
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