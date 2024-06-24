const onCreateOrderCreateResponseData =async (RS,RQ)=>{
    console.log(RS);
     
    let ob ={};
    ob.message = "Success";
    //ob.data = await onCreateOriginDesArray(RS,RQ);
    //ob.error = null;

    ob.id="";
    ob.itineraryRef=RS.orderReference;
    ob.lineItems=[];
    ob.passengers= await onCreatePassengerObject(RS);
    ob.status= await onCreateObjectForStaus(RS);
    ob.user={};

    let tPrice = await onCalculateTotalPriceObjet(RS.orderItem[0].fareDetailList);

    ob.subTotal=tPrice.total_amount;
    ob.disccount =tPrice.total_discount;
    ob.base =tPrice.total_baseFare;
    ob.tax=tPrice.total_tax;
    ob.totalPayable =RS.orderItem[0].price.totalPayable.total;
    ob.minPayable =((RS.partialPaymentInfo !== undefined ) ? RS.partialPaymentInfo.minimumPayableAmount : RS.orderItem[0].price.totalPayable.total ); 
    //ob.minPayable =0;
    ob.totalPaid=0;
    ob.creationTime=0;
    ob.tripSummary ={};
    ob.bookingTime=0;
    ob.issuedTime=0;
    ob.buketPublicUrl="";
    ob.expireDateTime=0;
    ob.scheduleCancelTime=0;
    ob.partialPaymentAllowed=(RS.partialPaymentInfo !== undefined )? true : false;
    ob.totalDue=0;
    ob.totalExchangeBeforeAmount= await onCreateTotalAmountForPenalty(ob.passengers,"Exchange","Before");

    let bdfare ={};
    bdfare.orderReference =RS.orderReference;
    bdfare.paymentTimeLimit = RS.paymentTimeLimit;
    bdfare.airlinePNR = RS.orderItem[0].paxSegmentList[0].paxSegment.airlinePNR;
    bdfare.rbd = RS.orderItem[0].paxSegmentList[0].paxSegment.rbd;
    bdfare.orderStatus = RS.orderStatus;
    bdfare.totalExchangeAfterAmount = await onCreateTotalAmountForPenalty(ob.passengers,"Exchange","Before");
    bdfare.totalRefundBeforeAmount = await onCreateTotalAmountForPenalty(ob.passengers,"Refund","Before");
    bdfare.totalRefundAfterAmount = await onCreateTotalAmountForPenalty(ob.passengers,"Refund","After");
    bdfare.partialPaymentInfo = RS.partialPaymentInfo;

    ob.BDFareObject = bdfare;
    
 
    
 
    return ob;
     
 }


 
 module.exports ={onCreateOrderCreateResponseData};


 async function onCreateTotalAmountForPenalty(passengers,type,applicability){

   let total_amount = 0;
   for(let m=0;m<passengers.length;m++)
   {
      let oFilterObj = passengers[m].penalties.filter(function(el){
      return  el.type === type && el.applicability === applicability;
      });

      if(oFilterObj.length === 1){

            total_amount = total_amount + parseInt(oFilterObj[0].amount,10);
         }else{
            total_amount = total_amount + 0;
         }
   }

   return total_amount;


 }

 async function onCalculateTotalPriceObjet(oList){

   let t_base =0, t_tax =0, t_discount = 0, t_vat = 0; t_amount = 0, obj ={};
   for(let m =0 ;m<oList.length; m++){

      t_base = t_base + oList[m].fareDetail.baseFare;
      t_tax  = t_tax  + oList[m].fareDetail.tax;
      t_discount = t_discount + oList[m].fareDetail.discount;
      t_vat = t_vat+ oList[m].fareDetail.vat;
      t_amount = t_amount + oList[m].fareDetail.subTotal;
   }

    obj.total_baseFare = t_base;
    obj.total_tax = t_tax;
    obj.total_discount = t_discount;
    obj.total_vat = t_vat;
    obj.total_amount = t_amount;

    return obj;


 }


 async function onCreateObjectForStaus(RS){
    let obj ={};
    obj.booked = true;
    obj.refundable = RS.orderItem[0].refundable ;

    

    return obj;

 }

 async function onCreatePassengerObject(RS){

    let oArray =[];

    let oPaxList = RS.paxList;
    //console.log(oPaxList.length);

    for(let m =0 ; m < oPaxList.length; m++)
    {
      let obj = {}, doc ={};
            doc.issueCountry= oPaxList[m].individual.identityDoc.issuingCountryCode;
            doc.nationalityCountry= oPaxList[m].individual.nationality;
            doc.passportNumber= oPaxList[m].individual.identityDoc.identityDocID;
            doc.passportPhoto= null;
            doc.visaPhoto = null;
            doc.expirationDate=oPaxList[m].individual.identityDoc.expiryDate.split("T")[0];
            doc.type = oPaxList[m].individual.identityDoc.identityDocType;

            obj.saveTraveler =null;
            obj.travelerId = null;
            obj.gender= getShortFormGender(oPaxList[m].individual.gender);
            obj.surname= oPaxList[m].individual.surname;
            obj.givenName=oPaxList[m].individual.givenName;
            obj.dateOfBirth= oPaxList[m].individual.birthdate.split("T")[0];
            obj.email="";
            obj.phoneNo="";
            obj.document=doc;


            let currency  =  RS.orderItem[0].price.totalPayable.curreny;
            let priceObject = await onFindPersonFareDetails(RS.orderItem[0].fareDetailList,oPaxList[m].ptc);
            
            let rgObject={};
            rgObject.basePrice =priceObject.baseFare;
            rgObject.serviceCharge =null;
            

            let oTax = {};
            oTax.adjustAmount = priceObject.tax;
            oTax.adjustType = "FLAT";
            oTax.adjustwith = "BASE";

            rgObject.tax = oTax;

            rgObject.gatewayFee =null;
            rgObject.productTotalPriceIncludingAll=priceObject.total;
            rgObject.productTaxAmount = priceObject.tax;
            obj.regularPriceDetails= rgObject;
            
            obj.baggageInformation=[];

            obj.penalties= await onCreatePenaltyObject(RS,oPaxList[m].ptc,currency);
            obj.ticketNumber="";
            obj.localIssueDate="";
            obj.customerLoyalty=null;
            obj.ssrCodes=[];
            obj.status="";
            obj.fareBasisCode="";
            obj.type = getShortPtc(oPaxList[m].ptc);
            obj.fullName= oPaxList[m].individual.givenName+" "+ oPaxList[m].individual.surname;
            obj.refundable= RS.orderItem[0].refundable;

         
            obj.subTotal= priceObject.total;
            obj.totalTax = priceObject.tax;
            obj.totalBase= priceObject.baseFare;
            obj.totalVat = priceObject.vat;

            
            let exBeforeAmount  = await onFindPersonExchangeAmount(RS.orderItem[0].penalty.exchangePenaltyList[0].exchangePenalty.penaltyInfoList,oPaxList[m].ptc,"Before Departure");
            if(exBeforeAmount.split(" ")[0] ===currency){
               obj.exchangeBeforeAmount =  parseInt(exBeforeAmount.split(" ")[1],10);
            }else{
               //obj.exchangeBeforeAmount =  exBeforeAmount ;
               obj.exchangeBeforeAmount =  0;
            }
            
            //obj.exchangeBeforeAmount= await onFindPersonExchangeAmount(RS.orderItem[0].penalty.exchangePenaltyList[0].exchangePenalty.penaltyInfoList,oPaxList[m].ptc,"Before Departure");
            //console.log(oPaxList[m].ptc);

            oArray.push(obj);
    }

    return oArray;

 }

 async function onCreatePenaltyObject(RS,type,currency){

   let oArray =[], exbeforeobj ={},exaftereobj ={},rfbeforeobj ={},rfafterobj={}; 
   
   
   
   let exchangeBeforeAmount =  await onFindPersonExchangeAmount(RS.orderItem[0].penalty.exchangePenaltyList[0].exchangePenalty.penaltyInfoList,type,"Before Departure");
   if(exchangeBeforeAmount.split(" ")[0] ===currency){
      //let exbeforeobj ={};
      exbeforeobj.type="Exchange";
      exbeforeobj.applicability="Before";
      exbeforeobj.amount = parseInt(exchangeBeforeAmount.split(" ")[1],10);
      exbeforeobj.currency = exchangeBeforeAmount.split(" ")[0];
      exbeforeobj.changeble=null;

   }else{
      exbeforeobj.type="Exchange";
      exbeforeobj.applicability="Before";
      //exbeforeobj.amount = exchangeBeforeAmount;
      exbeforeobj.amount = 0;
      exbeforeobj.currency = currency;
      exbeforeobj.changeble=exchangeBeforeAmount;
   }

   oArray.push(exbeforeobj);
   let exchangeAfterAmount =  await onFindPersonExchangeAmount(RS.orderItem[0].penalty.exchangePenaltyList[0].exchangePenalty.penaltyInfoList,type,"After Departure");
   if(exchangeAfterAmount.split(" ")[0] ===currency){
      //let exbeforeobj ={};
      exaftereobj.type="Exchange";
      exaftereobj.applicability="After";
      exaftereobj.amount = parseInt(exchangeBeforeAmount.split(" ")[1],10);
      exaftereobj.currency = exchangeBeforeAmount.split(" ")[0];
      exaftereobj.changeble=null;

   }else{
      exaftereobj.type="Exchange";
      exaftereobj.applicability="After";
      //exaftereobj.amount = exchangeBeforeAmount;
      exaftereobj.amount = 0;
      exaftereobj.currency = currency;
      exaftereobj.changeble=exchangeBeforeAmount;
   }
   oArray.push(exaftereobj);


   let refundBeforeAmount =  await onFindPersonRefundAmount(RS.orderItem[0].penalty.refundPenaltyList[0].refundPenalty.penaltyInfoList,type,"Before Departure");
   if(refundBeforeAmount.split(" ")[0] ===currency){
      //let exbeforeobj ={};
      rfbeforeobj.type="Refund";
      rfbeforeobj.applicability="Before";
      rfbeforeobj.amount = parseInt(refundBeforeAmount.split(" ")[1],10);
      rfbeforeobj.currency = refundBeforeAmount.split(" ")[0];
      rfbeforeobj.changeble=null;

   }else{
      rfbeforeobj.type="Refund";
      rfbeforeobj.applicability="Before";
      //rfbeforeobj.amount = refundBeforeAmount;
      rfbeforeobj.amount = 0;
      rfbeforeobj.currency = currency;
      rfbeforeobj.changeble=refundBeforeAmount;
   }

   oArray.push(rfbeforeobj);

   let refundAfterAmount =  await onFindPersonRefundAmount(RS.orderItem[0].penalty.refundPenaltyList[0].refundPenalty.penaltyInfoList,type,"After Departure");
   if(refundAfterAmount .split(" ")[0] ===currency){
      //let exbeforeobj ={};
      rfafterobj.type="Refund";
      rfafterobj.applicability="After";
      rfafterobj.amount = parseInt(refundAfterAmount .split(" ")[1],10);
      rfafterobj.currency = refundAfterAmount .split(" ")[0];
      rfafterobj.changeble=null;

   }else{
      rfafterobj.type="Refund";
      rfafterobj.applicability="After";
      //rfafterobj.amount = refundAfterAmount ;
      rfafterobj.amount = 0 ;
      rfafterobj.currency = currency;
      rfafterobj.changeble=refundAfterAmount;
   }
   oArray.push(rfafterobj);

   return oArray;

 }

 async function onFindPersonExchangeAmount(List,paxType,oStrings){

   //console.log(List);
   let oFilterObj = List.filter(function(el){
      return  el.penaltyInfo.type === oStrings;
   });


   if(oFilterObj.length === 1)
   {
         let oList = oFilterObj[0].penaltyInfo.textInfoList;
         //console.log(oList);
         let oFObj = oList.filter(function(el){
            return  el.textInfo.paxType === paxType;
         });

         if(oFObj.length === 1){

            return oFObj[0].textInfo.info[0];
         }else{
            return null
         }

   }else{
      return null;
   }

 }


  async function onFindPersonRefundAmount(List,paxType,oStrings){

   //console.log(List);
   let oFilterObj = List.filter(function(el){
      return  el.penaltyInfo.type === oStrings;
   });


   if(oFilterObj.length === 1)
   {
         let oList = oFilterObj[0].penaltyInfo.textInfoList;
         //console.log(oList);
         let oFObj = oList.filter(function(el){
            return  el.textInfo.paxType === paxType;
         });

         if(oFObj.length === 1){

            return oFObj[0].textInfo.info[0];
         }else{
            return null
         }

   }else{
      return null;
   }

 }

 

 async function onFindPersonFareDetails(List,paxType){

   let oFilterObj = List.filter(function(el){
      return  el.fareDetail.paxType === paxType;
   });

   let obj ={};
   //console.log(oFilterObj);
   
   if(oFilterObj.length === 1){

      obj.baseFare =  oFilterObj[0].fareDetail.baseFare;
      obj.tax      =  oFilterObj[0].fareDetail.tax;
      obj.vat      =  oFilterObj[0].fareDetail.vat;
      obj.total    =  (oFilterObj[0].fareDetail.baseFare + oFilterObj[0].fareDetail.tax + oFilterObj[0].fareDetail.vat);

   }else{
      obj.baseFare = null;
      obj.tax      = null;
      obj.vat      = null;
      obj.total    = null;

   }

   return obj;

 }
 
 function getShortFormGender(category){

   let ptc = "";
   switch(category)
   {
     case "Male":
      ptc ="M";
     break;
     case "Female":
      ptc ="F";
     break;
     
     
     default:
      ptc ="";
 
   }
 
   return ptc;
 
 }

 function getShortPtc(category){

   let ptc = "";
   switch(category)
   {
     case "Adult":
      ptc ="ADT";
     break;
     case "Child":
      ptc ="CHD";
     break;
     case "Infant":
      ptc ="INF";
     break;
     
     default:
      ptc ="";
 
   }
 
   return ptc;
 
 }

 