const onCreateFlightSearchResponseData =async (RS,RQ)=>{
   console.log(RQ);
    
   let ob ={};
   ob.message = "Success";
   ob.data = await onCreateOriginDesArray(RS,RQ);
   ob.error = null
   

   

   return ob;
    
}

module.exports ={onCreateFlightSearchResponseData};


async function onCreateOriginDesArray(RS,RQ){
    let oArray =[];
       // common parts.... 

       let Offers = RS.offersGroup;
       console.log("number of data:"+ Offers.length);
       let traceId = RS.traceId;

      for( let m =0; m < Offers.length; m++)
      {
         
         let obj1 ={};
         obj1.tripDescription = await onCreateTripDescriptionObject(Offers[m],RQ);
         //obj1.tripList =await onCreateTripListObject(Offers[m],traceId,RQ,m);
         //obj1.pricing = await onCreatePricingObject(Offers[m]); // retun an array..

         obj1.pricing = await onCreateNewPricingObject(Offers[m]); // retun an array..

         obj1.dataOrgin="BDFare";

         onCreateTripListObject(Offers[m],traceId,RQ,m).then(r =>
         {

            obj1.tripList = r;
            if(m === 24){
               console.log("check");
            }
                  switch(RQ.TripType)
                  {
                     case "Oneway":
                     
                        if( obj1.tripList[0].schedules && obj1.tripList[0].schedules.length > 0 )
                        {
                           
                           obj1.outboundElapsedTime =  obj1.tripList[0].elapsedTime;
                           obj1.inboundElapsedTime = 0;
                           obj1.totalElapsedTime =  obj1.outboundElapsedTime +  obj1.inboundElapsedTime ;
                           obj1.tripType =  "ONEWAY"
                           obj1.totalOutboundStopCount = obj1.tripList[0].totalStopCount;
                           obj1.totalInboundStopCount = 0;
                           obj1.totalStopCount = obj1.totalOutboundStopCount + obj1.totalInboundStopCount;
                           obj1.totalSegment = obj1.tripList[0].totalSegment;

                           //booking code list
                           //booking code list .. need to test again for oneWay...
                           if(obj1.pricing[0].hasOwnProperty("brandName") ===  false)
                           { 
                              obj1.pricing[0].bookingCodeList.push(obj1.tripList[0].bookingCodeList);
                              let bookingClases ="";
                             
                              for(let q = 0; q < obj1.pricing[0].bookingCodeList[1].length; q++)
                              {
                                 if(q === obj1.pricing[0].bookingCodeList[0].length -1 )
                                 {
                                    bookingClases+=obj1.pricing[0].bookingCodeList[0][q];

                                 }else{
                                    bookingClases+=obj1.pricing[0].bookingCodeList[0][q]+";";
                                 }
                                 
                              }

                              obj1.pricing[0].rbd = bookingClases;
                           }
                           oArray.push(obj1);
                        }
                        break;
                     case "Return":
                        

                        //if( obj1.tripList[0].schedules && obj1.tripList[0].schedules.length > 0 && obj1.tripList.length === 2 && obj1.tripList[1] !== undefined && obj1.tripList[1].hasOwnProperty("schedules") && obj1.tripList[1].schedules.length > 0)
                        //{

                        if( obj1.tripList.length === 2 && obj1.tripList[0] !== undefined && obj1.tripList[1] !== undefined)
                        {
                           obj1.outboundElapsedTime =  obj1.tripList[0].elapsedTime;
                           obj1.inboundElapsedTime =   obj1.tripList[1].elapsedTime;
                           obj1.totalElapsedTime =  obj1.outboundElapsedTime +  obj1.inboundElapsedTime ;
                           obj1.tripType =  "RETURN";
                           obj1.totalOutboundStopCount = obj1.tripList[0].totalStopCount;
                           obj1.totalInboundStopCount = obj1.tripList[1].totalStopCount;
                           obj1.totalStopCount = obj1.totalOutboundStopCount + obj1.totalInboundStopCount;
                           obj1.totalSegment = obj1.tripList[0].totalSegment + obj1.tripList[1].totalSegment;
                           
                           //booking code list
                           if(obj1.pricing[0].hasOwnProperty("brandName") ===  false)
                           { 
                              obj1.pricing[0].bookingCodeList.push(obj1.tripList[0].bookingCodeList);
                              obj1.pricing[0].bookingCodeList.push(obj1.tripList[1].bookingCodeList);

                              let bookingClases ="";
                              for(let p = 0; p < obj1.pricing[0].bookingCodeList[0].length; p++)
                              {
                                 bookingClases+=obj1.pricing[0].bookingCodeList[0][p]+";";
                              }

                              for(let q = 0; q < obj1.pricing[0].bookingCodeList[1].length; q++)
                              {
                                 if(q === obj1.pricing[0].bookingCodeList[1].length -1 ){
                                    bookingClases+=obj1.pricing[0].bookingCodeList[1][q];

                                 }else{
                                    bookingClases+=obj1.pricing[0].bookingCodeList[1][q]+";";
                                 }
                                 
                              }

                              obj1.pricing[0].rbd = bookingClases;


                           }
                           
                           oArray.push(obj1);
                        }

                        break;
                     case "Circle":

                        let oetTotal = 0;
                        let ostCount = 0;
                        let osegCount = 0;
                        let obookingCodes =[];
                        let oValidate = true;
                        for (let k = 0; k < obj1.tripList.length; k++)
                        {
                           oetTotal = oetTotal+ obj1.tripList[k].elapsedTime;
                           ostCount = oetTotal+ obj1.tripList[k].totalStopCount;
                           osegCount = oetTotal+ obj1.tripList[k].totalSegment;
                           obookingCodes.push(obj1.tripList[k].bookingCodeList);
                           if(obj1.tripList[k].schedules.length === 0){
                              oValidate = false;
                              break;
                           }
                        }

                        obj1.outboundElapsedTime = oetTotal;
                        obj1.inboundElapsedTime = 0;
                        obj1.totalElapsedTime =  obj1.outboundElapsedTime +  obj1.inboundElapsedTime ;
                        obj1.tripType = "MULTICITY";
                        obj1.totalOutboundStopCount = ostCount;
                        obj1.totalInboundStopCount = 0;
                        obj1.totalStopCount = obj1.totalOutboundStopCount + obj1.totalInboundStopCount;
                        obj1.totalSegment = osegCount;
                        //booking code list .. need to test again for multicity..
                        if(obj1.pricing[0].hasOwnProperty("brandName") ===  false)
                        { 
                           obj1.pricing[0].bookingCodeList = obookingCodes;
                           for(let q = 0; q < obj1.pricing[0].bookingCodeList[1].length; q++)
                              {
                                 if(q === obj1.pricing[0].bookingCodeList[0].length -1 )
                                 {
                                    bookingClases+=obj1.pricing[0].bookingCodeList[0][q];

                                 }else{
                                    bookingClases+=obj1.pricing[0].bookingCodeList[0][q]+";";
                                 }
                                 
                              }

                              obj1.pricing[0].rbd = bookingClases;
                        }
                        if(oValidate){
                           oArray.push(obj1);
                        }

                        break;
                     default:
                        obj1.inboundElapsedTime = 0;   
                        obj1.inboundElapsedTime = 0;
                        obj1.tripType =  "";
                        obj1.totalOutboundStopCount = 0;
                        obj1.totalInboundStopCount = 0;
                        obj1.totalStopCount = 0;
                        obj1.totalSegment = 0;


                  }

            });
         

         //oArray.push(obj1)
      }
       
       return oArray;
       
 
 
 }

 async function onCreateTripDescriptionObject(OfferObject,RQ){

    let oArray = [];
    //let oList = [];
    //oList  = OfferObjet.offer.paxSegmentList;


    for(let r = 0; r < RQ.OriginDest.length; r++)
    {
       let obj={};
       obj.departureDate = RQ.OriginDest[r].OriginDepRequest.date;
       obj.departureLocation = RQ.OriginDest[r].OriginDepRequest.iatA_LocationCode;
       obj.arrivalLocation = RQ.OriginDest[r].DestArrivalRequest.iatA_LocationCode;
       obj.pair = obj.departureLocation + " -> "+ obj.arrivalLocation;
       switch(RQ.TripType)
         {
            case "Oneway":
               obj.reversePair = null;

               break;
            case "Return":
               obj.reversePair = obj.arrivalLocation + " -> "+ obj.departureLocation;
               break;
            case "Circle":
               obj.reversePair = null;
               break;
            default:
               obj.reversePair = null;

         }

         oArray.push(obj);
       
    }


    return oArray;

 }

 
 async function onCreateTripListObject(OfferObjet,traceId,RQ,m){
   
    let oArray =[];
         let oList = [];
         oList  = OfferObjet.offer.paxSegmentList;
         
         for(let r = 0; r < RQ.OriginDest.length; r++)
            {

                  let om ={},obj ={}, oGroupList=[],arrival_code="", departure_code="";
                  /*obj.traceId = traceId;
                  obj.offerId = OfferObjet.offer.offerId;
                  obj.seatsRemain = OfferObjet.offer.seatsRemaining;
                  
                  om.BdFareOject= obj;*/

                  //if (m === 24){
                     //console.log("need to check here");
                  //}

                  departure_code =RQ.OriginDest[r].OriginDepRequest.iatA_LocationCode ;
                  arrival_code =RQ.OriginDest[r].DestArrivalRequest.iatA_LocationCode;
                  oGroupList = await onFindRouteListbyDepartureandArrival(oList,departure_code,arrival_code,m); 
                  
                  if(oGroupList.length > 0)
                  {                  
                     
                     obj.traceId = traceId;
                     obj.offerId = OfferObjet.offer.offerId;
                     obj.seatsRemain = OfferObjet.offer.seatsRemaining;
                  
                     om.BdFareOject= obj;
                     
                     om.schedules = await onCreateSchedulObject(oGroupList);
                     let stopOver = await StopOverTime(oGroupList,m);
                        //console.log(stopOver);
                        om.BdFareOject.stopOver= stopOver;
                        


                        let oSTCount ={};
                        oSTCount = await onFindNumberOfSegment(oGroupList);

                        om.elapsedTime = await onCalculateElapseTime(oGroupList,stopOver.stopOeverList);
                        om.finalDepartureDateTime =oSTCount.finalDepartureDateTime;
                        om.finalArrivalDateTime = oSTCount.finalArrivalDateTime;
                        om.airPlate= OfferObjet.offer.validatingCarrier;
                        om.totalSegment = oSTCount.oNumberOfSegment;
                        //om.totalStopCount = Math.ceil((oSTCount.oNumberOfSegment/2))+oSTCount.oNumberOfTechnicalStop;
                        om.totalStopCount = stopOver.noStopOver;
                        om.tolalTechnicalStop = oSTCount.oNumberOfTechnicalStop;
                        om.bookingCodeList = oSTCount.bookingCodeList;

                        //testing
                        //let dateTimeObj ={};
                        //dateTimeObj = ConvertDateTimeTo(oSTCount.finalDepartureDateTime)
                        //om.BdFareOject.epoch = ConvertDateTimeTo(oSTCount.finalDepartureDateTime).epoch;
                        
                        oArray.push(om);
                  }else{

                           //console.log(m);
                           //console.log(departure_code +","+ arrival_code);
                           //console.log(oList);


                  }
               

                  /*let stopOver = await StopOverTime(oGroupList,m)
                  om.BdFareOject.stopOver= stopOver;
                  


                  let oSTCount ={};
                  oSTCount = await onFindNumberOfSegment(oGroupList);

                  om.elapsedTime = await onCalculateElapseTime(oGroupList,stopOver.stopOeverList);
                  om.finalDepartureDateTime =oSTCount.finalDepartureDateTime;
                  om.finalArrivalDateTime = oSTCount.finalArrivalDateTime;
                  om.airPlate= OfferObjet.offer.validatingCarrier;
                  om.totalSegment = oSTCount.oNumberOfSegment;
                  //om.totalStopCount = Math.ceil((oSTCount.oNumberOfSegment/2))+oSTCount.oNumberOfTechnicalStop;
                  om.totalStopCount = stopOver.noStopOver;
                  om.tolalTechnicalStop = oSTCount.oNumberOfTechnicalStop;

                  //testing
                  //let dateTimeObj ={};
                  //dateTimeObj = ConvertDateTimeTo(oSTCount.finalDepartureDateTime)
                  //om.BdFareOject.epoch = ConvertDateTimeTo(oSTCount.finalDepartureDateTime).epoch;
                   
                  oArray.push(om);*/
            }



       return oArray;
       
 
 }

 function ConvertDateTimeTo(dateTime){

      let epoch = 0;
      let DateTime = new Date(dateTime);
      epoch = DateTime.getTime()/1000.0;

      let obj ={};
      obj.epoch = epoch;
      return obj;
 }


 async function onFindRouteListbyDepartureandArrival(oList,departure_Code,arrival_code,m){

      let s_Index = -1;
      let e_Index  = -1;
      let om ={};
      let oAr =[];
      s_Index  = oList.findIndex(function(el){
         return el.paxSegment.departure.iatA_LocationCode === departure_Code;
      });

      e_Index  = oList.findIndex(function(el){
         return el.paxSegment.arrival.iatA_LocationCode === arrival_code;
      });

      if(s_Index !== -1 && e_Index !== -1)
      {
         for(let m = s_Index; m <= e_Index ; m++)
         {
            oAr.push(oList[m]);
         }
      }else
      {
         if(e_Index === -1){
            console.log("arrival code: "+ arrival_code  +" not found in List")
         }

         if(s_Index === -1){
            console.log("departure code: "+ departure_Code  +" not found in List")
         }
         console.log("Array object number:"+m);
         //console.log(oList);
      }

      return oAr;
 }
 

 async function onCreateSchedulObject(segmentList){
    var oarray =[];
    

    for( let p =0; p < segmentList.length; p++)
    {

      let  segment = segmentList[p].paxSegment;
      
      let obj = {};
      obj.frequency ="";
      obj.stopCount =0;
      obj.totalMilesFlown = 0;
      obj.elapsedTime = parseInt(segment.duration,10);
      obj.departure = await onCreateArrivalDepartureObject(segment.departure);
      obj.arrival = await onCreateArrivalDepartureObject(segment.arrival);
      obj.carrier= await onCreateCarrierObject(segment) ;
      obj.rbd = segment.rbd;
      obj.flightDuration = segment.duration;
      obj.departureDateAdjustment =0;
      obj.marketingCarriername = segment.marketingCarrierInfo.carrierDesigCode;
      obj.cabinType = segment.cabinType; // get from first index object..
      obj.eticketable = null;
      obj.fullArrivalDateTime= segment.arrival.aircraftScheduledDateTime.slice(0,-1).replace("T"," ");
      obj.fullDepartureDateTime= segment.departure.aircraftScheduledDateTime.slice(0,-1).replace("T"," ");;
      oarray.push(obj);


    }
    
    return oarray;

 }

 async function onCreateArrivalDepartureObject(sgObj){
    
   let dateTime  =  sgObj.aircraftScheduledDateTime.split("T");
   let time = dateTime[1];
   let onlyTime  = time.slice(0,-1);
   
   let obj ={};
    obj.airport = sgObj.iatA_LocationCode;
    obj.city = sgObj.iatA_LocationCode;
    obj.country = null;
    obj.time = time;
    obj.terminal = sgObj.terminalName;
    obj.dateAdjustment = 0;
    obj.onlyTime = onlyTime;

    return obj;
 }


 async function onCreateCarrierObject(segment){
    var obj ={}, obj1 ={};
    
    obj1.code =segment.iatA_AircraftType.iatA_AircraftTypeCode;
    obj1.typeForFirstLeg = null;
    obj1.typeLastLet = null;

    obj.marketing = segment.marketingCarrierInfo.carrierDesigCode;
    obj.marketingFlightNumber = segment.marketingCarrierInfo.marketingCarrierFlightNumber;
    obj.operating = segment.operatingCarrierInfo.carrierDesigCode;
    obj.operatingFlightNumber = segment.flightNumber;
    obj.alliances = null;
    obj.equipment = obj1;

    return obj;


 }


 async function onCreateNewPricingObject(OfferObject){
   var  oArray =[], obj={}, tf ={};

      if(OfferObject.offer.upSellBrandList === null)
      {
            return onCreatePricingObject(OfferObject);

      }else{

         let brandInfoList  = OfferObject.offer.upSellBrandList;
         for(let m = 0; m < brandInfoList.length; m++)
         {
            //oArray.push(obj);
          //return oArray;
          let upsellBrandList =  await onFormatUpSellBrandList(OfferObject.offer.upSellBrandList);

          return  upsellBrandList;

         }
      }

 }

 async function onCreatePricingObject(OfferObject){

   //console.log("check: "+ OfferObject.offer.fareDetailList.length); 
   
   var  oArray =[], obj={}, tf ={};


    obj.brandInfo = null;
    obj.passengers = await onCreatePassengerObject(OfferObject.offer,false);
    
    
    tf.totlPrice = OfferObject.offer.price.totalPayable.total;
    tf.totalTaxAmount = (await onCalculateTaxAmount(obj.passengers)).totalTaxAmount;;
    tf.currency = OfferObject.offer.price.totalPayable.currency;
    tf.baseFareAmount = null;
    tf.baseFareCurencty = null;
    tf.constructionAmount = null;
    tf.constructionCurrency = null;
    tf.equivalentAmount = null;
    tf.equivalentCurrency = null;

    obj.totalFare = tf;

    obj.bookingCodeList =[];

    oArray.push(obj);
    return oArray;

 }

 async function onCreatePassengerObject(Offer,forBarndedFare){
    
   let oArr =[];
   let fareDetailList =[]; 
   fareDetailList = Offer.fareDetailList;

   
   //console.log(fareDetailList.length);
   for(let m = 0; m< fareDetailList.length; m++)
   {
      let obj ={}, of={}, fareDetail ={};

      fareDetail = fareDetailList[m].fareDetail;
   
      of.totalFare = fareDetail.subTotal;
      of.totalTaxAmount = fareDetail.tax;
      of.currency = fareDetail.currency;
      of.baseFareAmount = fareDetail.baseFare;
      of.baseFareCurrency = fareDetail.currency;
      of.equivalentAmount = null;
      of.equivalentCurrency = null;
      of.constructionAmount = null;
      of.constructionCurrency = null;
      of.exchangeRateOne = null;

      obj.passengerType = fareDetail.paxType;
      obj.passengerNo = fareDetail.paxCount;
      obj.fareBasisCodeList = [];
      obj.fare = of;

      obj.communityResources= await onCreateCommunityResouceObject(Offer,fareDetail.paxType);


      if(forBarndedFare === false){
         //obj.penalties = await onCreatePenaltyObject(Offer);
         obj.penalties = null;
         obj.refundable = Offer.refundable;

      }
      

      oArr.push(obj);

   }
   
   return oArr;



 }

 async function onFormatUpSellBrandList(BList){

    let oArray = [];
    for( let m = 0; m < BList.length; m++){
      let obj ={};
      let  brandObj = BList[m].upSellBrand;
      obj.offerId = brandObj.offerId;
      obj.brandName =  brandObj.brandName;
      obj.refundable = brandObj.refundable;
      obj.rbd = brandObj.rbd;
      obj.meal = brandObj.meal;
      obj.seat = brandObj.seat;
      obj.miles = brandObj.miles;
      obj.refundAllowed = brandObj.refundAllowed;
      obj.exchangeAllowed =  brandObj.exchangeAllowed;
      obj.penalty  = brandObj.penalty;
      obj.passengers = await onCreatePassengerObject(brandObj ,true);
      obj.brandInfo =null;
      obj.facilities=null;
      obj.typeWiseFareBasisMap =null;


      //
      let tf={};
      tf.totlPrice = brandObj.price.totalPayable.total;
      tf.totalTaxAmount = (await onCalculateTaxAmount(obj.passengers)).totalTaxAmount;
      tf.currency = brandObj.price.totalPayable.currency;
      tf.baseFareAmount = null;
      tf.baseFareCurencty = null;
      tf.constructionAmount = null;
      tf.constructionCurrency = null;
      tf.equivalentAmount = null;
      tf.equivalentCurrency = null;

      obj.totalFare = tf;
      

      oArray.push(obj);


    }

    return oArray;

 } 

 async function onCalculateTaxAmount(olist){

   let obj = {};
   obj.totalTaxAmount = 0;

   for(let m = 0; m < olist.length; m++){

      obj.totalTaxAmount = obj.totalTaxAmount + olist[m].fare.totalTaxAmount;
   }

   return obj;

 }


 async function onCreateCommunityResouceObject(Offer,paxType){


    /*var obj ={}, oArr = [];
    var oFlightAmenities ={};
    var obeverage ={}, oent ={}, ofood ={}, olayout= {}, opower ={}, oseat ={}, owifi={};

    obeverage.alcoholicCost = "free";
    obeverage.nonAlcoholicCost = "free";
    obeverage.exists = true;

    oent.exists = false;
    oent.type = "none";

    ofood.exists = true;
    ofood.cost = "free";
    ofood.type =  "meal";

    olayout.rowLayout ="3-3";
    olayout.directAisleAccess = false;

    opower.type = "none";

    oseat.pitch =28;
    oseat.type ="below average legroom";

    owifi.exists= false;

    oFlightAmenities.beverage =  obeverage;
    oFlightAmenities.entertainment = oent;
    oFlightAmenities.food = ofood;
    oFlightAmenities.layout = olayout;
    oFlightAmenities.power = opower;
    oFlightAmenities.seat = oseat;
    oFlightAmenities.wifi = owifi;*/

    
    let bgList =[], oArr = [];
    bgList = Offer.baggageAllowanceList;

    for(let c = 0; c < bgList.length; c++){

         let bgAllowance = bgList[c].baggageAllowance;
         let obj = {};
         obj.departure = bgAllowance.departure;
         obj.arrival = bgAllowance.arrival;
         //obj.flightAmenities = oFlightAmenities;
         obj.flightAmenities = null;

         var obagges ={};
         obagges.cabin = await onCreateCabinCheckInObject(bgAllowance.cabin,"cabin",paxType);
         obagges.checkIn =await onCreateCabinCheckInObject(bgAllowance.checkIn,"checkin",paxType);
         obj.baggage = obagges;

         oArr.push(obj);
    }
    return oArr;


 }

 async function onCreateCabinCheckInObject(list,type,paxType){

    
    /// this funciton is not working property . need to fix this tonight.
    //console.log(list);
    
     

    let oFilterObj = list.filter(function(el){
               return  el.paxType === paxType;

    });

   var obj ={};

   if(oFilterObj.length === 1)
   {

      obj.id = null;
      obj.pieceCount = null;
      if(type === "checkin"){
         //console.log(list[p].allowance);

         /*if (paxType ==="Adult" && oFilterObj[0].allowance =="10KG"){
            console.log(list);
            
         }*/

         obj.weight = oFilterObj[0].allowance.slice(0,2);
         if(oFilterObj[0].allowance.length === 4){
            obj.unit = oFilterObj[0].allowance.slice(2);
         }else{
            obj.unit = null;
         }
         
       }else{
         obj.weight =  oFilterObj[0].allowance;
         obj.unit =null;
       }
      obj.description1 = null;
      obj.description2 = null;

   }else{
      obj.id = null;
      obj.pieceCount = null;
      obj.weight = null;
      obj.unit = null;
      obj.description1 = null;
      obj.description2 = null;
   }


   return obj;
 }

 async function onCreatePenaltyObject(RS){
    var oArray =[], obj = {};

    obj.type= "";
    obj.applicability = "";
    obj.refundable = null;
    obj.amount = 0;
    obj.currency ="BDT";
    obj.changeable = true;

    oArray.push(obj);
    return oArray;
 }

 async function onFindNumberOfSegment(oSegmentList){
   
   let obj ={};
   obj.oNumberOfSegment = 0;
   obj.oNumberOfTechnicalStop = 0;
   obj.eLapseTime = 0;
   obj.finalDepartureDateTime ="";
   obj.finalArrivalDateTime ="";
   obj.bookingCodeList = [];
   for( let p =0; p < oSegmentList.length; p++)
    {
         
      
         let segment  =  oSegmentList[p].paxSegment;
         if(segment.technicalStopOver){
            obj.oNumberOfTechnicalStop++;
         }else{
            
            obj.oNumberOfSegment++;
         }

         obj.eLapseTime = (parseInt(obj.eLapseTime,10) + parseInt(segment.duration,10));
         //console.log(obj.eLapseTime);
         if(p === 0){
            let departureDateTime = segment.departure.aircraftScheduledDateTime.slice(0,-1).split("T");
            obj.finalDepartureDateTime = departureDateTime[0] +" "+ departureDateTime[1];
         }

         if(p === oSegmentList.length -1)
         {
            let arrivalDateTime = segment.arrival.aircraftScheduledDateTime.slice(0,-1).split("T");
            obj.finalArrivalDateTime = arrivalDateTime[0] +" "+ arrivalDateTime[1];
         }

         obj.bookingCodeList.push(segment.rbd);

    }

    return obj;
 }


 async function onFindOutboundInboundList(oLists,RQ){

    let flobj ={};
    flobj.OutBoundList=[];
    flobj.InBoundList =[];

    let oIndex = oLists.findIndex(function(el){
      return el.paxSegment.arrival.iatA_LocationCode === RQ.OriginDest[0].DestArrivalRequest.iatA_LocationCode;
    });

    for (let p = 0 ; p< oLists.length; p++){

         if(p <= oIndex)
         {
            flobj.OutBoundList.push(oLists[p].paxSegment);
         }else{
            flobj.InBoundList.push(oLists[p].paxSegment);
         }

    }

   return flobj;

 }


 async function StopOverTime(flist,m){

   let obj ={};
   obj.numberOfSegment = 0;
   obj.numberOfTechnicalStop = 0;
   obj.stopOeverList =[];
   obj.noStopOver = flist.length - 1;

   for( let p =0; p < flist.length; p++)
    {
         if(flist[p].paxSegment.technicalStopOver)
         {
            obj.numberOfTechnicalStop++;
         }else{
            
            obj.numberOfSegment++;
         } 

    }


    for(let q =0 ; q < obj.noStopOver; q++)
    {

         let stp ={};
         if(flist[q]!== undefined){


         
         stp.ID = q;
         stp.StopOverAt = flist[q].paxSegment.arrival.iatA_LocationCode;

         if(flist[q+1] !== undefined){
             
            let endDate =  flist[q+1].paxSegment.departure.aircraftScheduledDateTime.slice(0,-1);

            let startDate = flist[q].paxSegment.arrival.aircraftScheduledDateTime.slice(0,-1);

            let diff =  Date.parse( endDate ) - Date.parse( startDate );

            stp.nextOperatingCarrierCode =  flist[q+1].paxSegment.operatingCarrierInfo.carrierDesigCode;
            stp.nextOperatingCarrierName =  flist[q+1].paxSegment.operatingCarrierInfo.carrierName;
            stp.nextAirTypeCode = flist[q+1].paxSegment.iatA_AircraftType.iatA_AircraftTypeCode;
            stp.nextFlightNumber =  flist[q+1].paxSegment.flightNumber;
            stp.nextTerminalName  = flist[q+1].paxSegment.departure.terminalName;
            stp.lastArrivalDateTime = startDate;
            stp.nextFlightDateTime = endDate;
            stp.timeObject = await dateDiffGap(endDate,startDate);
            stp.stopOverTime = ((parseInt(stp.timeObject.d,10) *24*60) + (parseInt(stp.timeObject.h) * 60) + parseInt(stp.timeObject.m,10) );
            
            //console.log(stp.TimeObject);
         }else{
            stp.stopOverTime = 0;
         }
      
         obj.stopOeverList.push(stp);
         
      }

    }

    
   return obj;

 }


 async function dateDiffGap( str2, str1 ) {
   var diff = Date.parse( str2 ) - Date.parse( str1 ); 
   return isNaN( diff ) ? NaN : {
       diff : diff,
       ms : Math.floor( diff            % 1000 ),
       s  : Math.floor( diff /     1000 %   60 ),
       m  : Math.floor( diff /    60000 %   60 ),
       h  : Math.floor( diff /  3600000 %   24 ),
       d  : Math.floor( diff / 86400000        )
   };

   //return  Math.round(((diff % 86400000) % 3600000) / 60000);
}

async function onCalculateElapseTime(fList,StopOverList){

   let totalElpaseTime = 0;
   for(let p = 0; p < fList.length; p++){

      //totalElpaseTime = totalElpaseTime + parseInt(fList[p].duration,10);
      totalElpaseTime = totalElpaseTime + parseInt(fList[p].paxSegment.duration,10);
      if(StopOverList[p] !== undefined){
         totalElpaseTime = totalElpaseTime + parseInt(StopOverList[p].stopOverTime,10);
      }

   }
   return totalElpaseTime;

}
