const OrderCancelController = require('../Api_Calls/BDFareOrderCancel');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOrderCancel = new OrderCancelController(qObj);
        
    }

   async onRetrieveApisDataForOrderCancel()
   {
        let {status,statusText,data,orderReference,paymentTimeLimit} = await this.BDFareOrderCancel.OrderCancel();
        if(status === 200)
        {
      
            return {
                status:200,
                statusText:'success',
                data:data,
                orderReference: orderReference,
                paymentTimeLimit:paymentTimeLimit
            }
        }else{
            return {
                status:500,
                statusText:statusText
            }
        }


        
    }
}