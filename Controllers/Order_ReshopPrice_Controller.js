const OrderReshopPriceController = require('../Api_Calls/BDFareOrderReshopPrice');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOrderReshopPrice = new OrderReshopPriceController(qObj);
        
    }

   async onRetrieveApisDataForOrderReshopPrice()
   {
        let {status,statusText,data} = await this.BDFareOrderReshopPrice.OrderReshopPrice();
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