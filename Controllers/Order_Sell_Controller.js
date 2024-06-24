const OrderSellController = require('../Api_Calls/BDFareOrderSell');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOrderSell = new OrderSellController(qObj);
        
    }

   async onRetrieveApisDataForOrderSell()
   {
        let {status,statusText,data} = await this.BDFareOrderSell.OrderSell();
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