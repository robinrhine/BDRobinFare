const OrderRetrieveController = require('../Api_Calls/BDFareOrderRetrieve');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOrderRetrieve = new OrderRetrieveController(qObj);
        
    }

   async onRetrieveApisDataForOrderRetrieve()
   {
        let {status,statusText,data} = await this.BDFareOrderRetrieve.OrderRetrieve();
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