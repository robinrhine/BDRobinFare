const BDFareController = require('../Api_Calls/BDFare');
const s ={};
module.exports =s.searchController = class{

    constructor(qObj){
    
        this.BDFare = new BDFareController(qObj);
        
    }

   async onRetrieveApisDataForFlights()
   {
        let {status,statusText,data} = await this.BDFare.SearchFlights();
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
