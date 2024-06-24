const onCreatePayloadDataForOrderChange =(QS)=>{

    //console.log(JSON.stringify(QS))
   let ob ={};
   ob.orderReference = QS.orderReference;
   ob.issueTicketViaPartialPayment = QS.issueTicketViaPartialPayment;
   
   
   return ob;
    
}

module.exports ={onCreatePayloadDataForOrderChange};