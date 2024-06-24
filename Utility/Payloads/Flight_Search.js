const onCreatePayloadData =async (QS)=>{

    //console.log(JSON.stringify(QS))


    

   let ob ={};
   ob.pointOfSale = "BD";
   ob.request ={};
   //ob.request.OriginDest = await onCreateOriginDesArray(QS);
   ob.request.OriginDest = QS.OriginDest;
   ob.request.Pax= await onCreatePaxArray(QS.Adults,QS.Childrens,QS.Infants);
   
   

   

   // travel peference object...
   let tp = {};
   //tp.vendorPref=["TG"];
   tp.vendorPref= QS.PeferAirlineCodes;
   tp.CabinCode = QS.TicketClass;

   // Shoping Criteria Oject...
   let sc ={};
   //sc.tripType = "Oneway";
   sc.TripType = QS.TripType;
   sc.TravelPreferences =tp;
   sc.ReturnUPSellInfo = true;

   ob.request.ShoppingCriteria=sc;

   return ob;
   
    
}

module.exports ={onCreatePayloadData};



async function onCreateOriginDesArray(QS){
   let oArray =[],obj1 = {},obj2 = {};
      // common parts.... 
      obj1.OriginDepRequest ={};
      obj1.OriginDepRequest.IATA_LocationCode = QS.From;
      obj1.OriginDepRequest.Date =QS.OutBoundDate;
      obj1.DestArrivalRequest ={};
      obj1.DestArrivalRequest.IATA_LocationCode =QS.To;
      oArray.push(obj1);

    //if(QS.TripType ===1)
    if(QS.TripType ==="Oneway")
    {
      return oArray;
    }else if(QS.TripType ==="Return")
    {
      
      obj2.OriginDepRequest ={};
      obj2.OriginDepRequest.iatA_LocationCode = QS.To;
      obj2.OriginDepRequest.Date =QS.InBoundDate;
      obj2.DestArrivalRequest ={};
      obj2.DestArrivalRequest.IATA_LocationCode =QS.From;
      oArray.push(obj2);
      return oArray;
    }

     

}

async function onCreatePaxArray(Adult,Child,Infant){
   let oPaxAdultArray =[];
   let oPaxChildArray =[];
   let oPaxInfantArray =[];
   let oTotalPaxArray =[];
   
   let oNAdult = parseInt(Adult,10);
   let oNChild = parseInt(Child,10);
   let oNInfant = parseInt(Infant,10);
   let oNumerofPax =  oNAdult + oNChild + oNInfant;
   let counter = 1;
   let limit = 0;
   if(oNAdult > 0)
   {
       limit = oNAdult;
       oPaxAdultArray = await createPaxObjectArray(counter,limit,"ADT");
   }

   if(oNChild > 0)
   {
    limit = oNChild+oPaxAdultArray.length;
    console.log("Limit:"+limit);
    oPaxChildArray = await createPaxObjectArray(oPaxAdultArray.length+1,limit,"C11");
   }
  if(oNInfant > 0)
  {
    limit = oNInfant+oPaxAdultArray.length+oPaxChildArray.length;
    //oPaxInfantArray = await createPaxObjectArray(oPaxChildArray.length+oPaxAdultArray.length+1,limit,"C02");
    oPaxInfantArray = await createPaxObjectArray(oPaxChildArray.length+oPaxAdultArray.length+1,limit,"INF");
  }
  oTotalPaxArray = [...oPaxAdultArray, ...oPaxChildArray,...oPaxInfantArray];
  return oTotalPaxArray;
}

async function createPaxObjectArray(count,limit,ptcType)
{
  let oPaxArr =[];
  for( let counter=count; counter <= limit; counter++)
  {
        let oPax ={};
        oPax.PaxID = "PAX"+counter.toString();
        oPax.PTC = ptcType;
        oPaxArr.push(oPax);
  }
  return oPaxArr;
}



function _fare_category_desc(fare_category){

    let fareClass = "";
    switch(fare_category)
    {
      case "M":
        fareClass ="Economy";
      break;
      case "W":
        fareClass ="Economy Premium";
      break;
      case "C":
        fareClass ="Business";
      break;
      case "F":
        fareClass ="First";
      break;
      default:
        fareClass ="";
  
    }
  
    return fareClass;
  
  }