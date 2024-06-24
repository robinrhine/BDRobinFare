const OfferPriceController = require('../Api_Calls/BDFareOfferPrice');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFareOfferPirce = new OfferPriceController(qObj);
        
    }

   async onRetrieveApisDataForOfferPrice()
   {
        let {status,statusText,data} = await this.BDFareOfferPirce.SearchOfferPrice();
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