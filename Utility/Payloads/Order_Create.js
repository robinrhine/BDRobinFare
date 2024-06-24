const onCreatePayloadDataForOrderCreate =async (QS)=>{

    //console.log(JSON.stringify(QS))
   let ob ={};
   ob.traceId = QS.traceId;
   ob.offerId = QS.offerId;
   ob.request ={};
   ob.request.contactInfo={};
   ob.request.paxList=[];

    
    let CI ={};
    CI.phone = {};
    CI.phone.phoneNumber= QS.contactInfo.phoneNumber;
    CI.phone.countryDialingCode= QS.contactInfo.dialingCode;
    CI.emailAddress =QS.contactInfo.email;

    // assign contact info object with value.
    ob.request.contactInfo= CI;

    ob.request.paxList = await onCreatePaxObjectList(QS.passengerList);
    
    
    return ob;
    
   
   
    
}



module.exports ={onCreatePayloadDataForOrderCreate};

async function onCreatePaxObjectList(pList)
{
    let oPaxArry =[];
    console.log(pList.length);

    for( let p =0; p < pList.length; p++)
    {
        let px ={};
        px = await onCreatePaxObject(pList[p]);
        console.log(px);
        oPaxArry.push(px);

        if(oPaxArry.length === pList.length){
           console.log(oPaxArry.length);
            return oPaxArry;

        }
    }
    //return oPaxArry;
}

async function onCreatePaxObject(oPax){

    let obj ={};
    obj.ptc = oPax.ptc;
    obj.individual ={};
    obj.individual.givenName=oPax.givenName; // max 45 and min 2 character length...
    obj.individual.surname = oPax.surname;   // max 45 and min 2 character length...
    obj.individual.gender = oPax.gender;
    obj.individual.birthdate = oPax.birthDate;
    obj.individual.nationality = oPax.nationality;
    obj.individual.identityDoc ={};
    obj.individual.identityDoc.identityDocType= oPax.identityType;
    obj.individual.identityDoc.identityDocID= oPax.identityNumber;
    obj.individual.identityDoc.issuingCountryCode= oPax.issuingCountryCode;
    obj.individual.identityDoc.expiryDate= oPax.identityExpiryDate;

    // check assosiate passenger..

    if(oPax.associatePassenger){
            obj.individual.associatePax={};
            obj.individual.associatePax.givenName= oPax.associatePassenger.givenName;
            obj.individual.associatePax.surname = oPax.associatePassenger.surname;
    }else{
            obj.individual.associatePax= null;
    }

    //check special request.......

    if(oPax.specialRequest && oPax.specialRequest.length > 0)
    {
        obj.individual.sellSSR =[];
        for( let i =0; i< oPax.specialRequest.length; i++){
             let ssr ={};
             ssr.ssrRemark = oPax.specialRequest[i].remark;
             ssr.ssrCode   = oPax.specialRequest[i].code;
             if(oPax.specialRequest[i].airlineCode &&  oPax.specialRequest[i].airlineAccount){
                    ssr.loyalityProgramAccount ={};
                    ssr.loyalityProgramAccount.airlineDesigCode = oPax.specialRequest[i].airlineCode;
                    ssr.loyalityProgramAccount.accountNumber = oPax.specialRequest[i].airlineAccount;
             }

             obj.individual.sellSSR.push(ssr);
        }

    }

    return obj;



}