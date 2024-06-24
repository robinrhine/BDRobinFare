const BDFareBalanceController = require('../Api_Calls/BDFareGetBalance');
const s ={};
module.exports =s.balanceController = class{

    constructor(qObj){
    
        this.BDFareBalance = new BDFareBalanceController(qObj);
        
    }

   async onRetrieveApisDataForGetBalance()
   {
        let {status,statusText,data} = await this.BDFareBalance.RetrieveBalance();
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
