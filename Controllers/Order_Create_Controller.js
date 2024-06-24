const OrderCreateController = require('../Api_Calls/BDFareOrderCreate');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOrderCreate = new OrderCreateController(qObj);
        
    }

   async onRetrieveApisDataForOrderCreate()
   {
        let {status,statusText,data} = await this.BDFareOrderCreate.OrderCreate();
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