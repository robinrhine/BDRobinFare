const onCreatePayloadDataForOrderReshopPrice =(QS)=>{

    //console.log(JSON.stringify(QS))
   let ob ={};
   ob.orderReference = QS.orderReference;
   
   
   return ob;
    
}

module.exports ={onCreatePayloadDataForOrderReshopPrice};