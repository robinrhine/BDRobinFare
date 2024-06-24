const onCreatePayloadDataForOfferPirce =(QS)=>{

console.log(JSON.stringify(QS))
   let ob ={};
   ob.traceId = QS.traceId;
   ob.offerId = QS.offerId;
   
   return ob;
    
}

module.exports ={onCreatePayloadDataForOfferPirce};