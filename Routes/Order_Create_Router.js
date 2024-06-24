const OrderCreateController = require('../Controllers/Order_Create_Controller');
const {onCreatePayloadDataForOrderCreate}  = require('../Utility/Payloads/Order_Create');
const {onRetrieveEndPoints}  = require('../Utility/EndPoints');
const {onCreateOrderCreateResponseData} =require('../Utility/Response/Order_Create');
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}
const OrderCreateInputs =(req,res)=>{

    let qObj ={};
            
    qObj.traceId   = req.body.traceId;  
    qObj.offerId   = req.body.offerId;
    qObj.contactInfo = req.body.contactInfo;
    qObj.passengerList = req.body.passengerList; 
    

    if(qObj.traceId !== "" && qObj.offerId.length > 0)
    {
         onCreatePayloadDataForOrderCreate(qObj).then(r =>{

            qObj.Payload = r;
            //res.status(200).json({Payload:qObj.Payload});
            if(process.env.NODE_ENV !=="PROD"){
                qObj.secrect_key = process.env.DEV_API_KEY;
                qObj.api_endPoint = onRetrieveEndPoints("order_create");
                qObj.apiURL = process.env.DEV_URL+ qObj.api_endPoint ;
            }else{
                qObj.secrect_key = process.env.PROD_API_KEY;
                qObj.api_endPoint = onRetrieveEndPoints("order_create");
                qObj.apiURL = process.env.PROD_URL+ qObj.api_endPoint ;
            }

            const orderCreate = new OrderCreateController(qObj);
            orderCreate.onRetrieveApisDataForOrderCreate().then(result =>
                {
                            if(result.status === 200)
                            {
                                
                                //res.status(200).json({success:true,Results:result.data});
                                onCreateOrderCreateResponseData(result.data,qObj).then(r =>{
                                    res.status(200).json(r);
                                });
            
                            }else{
                               
                                res.status(500).json({
                                    success:false,
                                    errorMessage:result.statusText
                                });
                            }
            
                });


        });
    }

    
    
}

const TestOrderCreateOutputs =(req,res)=>{

    let qObj ={};
            
    qObj.traceId   = req.body.traceId;  
    qObj.offerId   = req.body.offerId;
    qObj.contactInfo = req.body.contactInfo;
    qObj.passengerList = req.body.passengerList; 
    

    if(qObj.traceId !== "" && qObj.offerId.length > 0)
    {
         onCreatePayloadDataForOrderCreate(qObj).then(r =>{

            qObj.Payload = r;
            //res.status(200).json({Payload:qObj.Payload});
            
            let oRes = getResponseObject();
            //res.status(200).json(oRes);
            onCreateOrderCreateResponseData(oRes.Results).then(r =>{
                res.status(200).json(r);
            });

            
            


        });
    }

    
    
}

module.exports={OrderCreateInputs,TestOrderCreateOutputs};

function getResponseObject(){

    return obj={
        "success": true,
        "Results": {
            "orderReference": "BDF240612284",
            "paymentTimeLimit": "2024-06-12T03:26:38.923",
            "orderItem": [
                {
                    "validatingCarrier": "BG",
                    "refundable": true,
                    "fareType": "OnHold",
                    "paxSegmentList": [
                        {
                            "paxSegment": {
                                "departure": {
                                    "iatA_LocationCode": "DAC",
                                    "terminalName": "2",
                                    "aircraftScheduledDateTime": "2024-08-25T11:30:00"
                                },
                                "arrival": {
                                    "iatA_LocationCode": "BKK",
                                    "terminalName": null,
                                    "aircraftScheduledDateTime": "2024-08-25T15:00:00"
                                },
                                "marketingCarrierInfo": {
                                    "carrierDesigCode": "BG",
                                    "marketingCarrierFlightNumber": "388",
                                    "carrierName": "Biman Bangladesh Airlines"
                                },
                                "operatingCarrierInfo": {
                                    "carrierDesigCode": "BG",
                                    "carrierName": "Biman Bangladesh Airlines"
                                },
                                "iatA_AircraftType": {
                                    "iatA_AircraftTypeCode": "738"
                                },
                                "rbd": "K",
                                "flightNumber": "388",
                                "segmentGroup": 0,
                                "returnJourney": false,
                                "airlinePNR": "SQOSET",
                                "technicalStopOver": null,
                                "duration": "150",
                                "cabinType": "Economy"
                            }
                        },
                        {
                            "paxSegment": {
                                "departure": {
                                    "iatA_LocationCode": "BKK",
                                    "terminalName": null,
                                    "aircraftScheduledDateTime": "2024-08-28T16:15:00"
                                },
                                "arrival": {
                                    "iatA_LocationCode": "DAC",
                                    "terminalName": "2",
                                    "aircraftScheduledDateTime": "2024-08-28T18:00:00"
                                },
                                "marketingCarrierInfo": {
                                    "carrierDesigCode": "BG",
                                    "marketingCarrierFlightNumber": "389",
                                    "carrierName": "Biman Bangladesh Airlines"
                                },
                                "operatingCarrierInfo": {
                                    "carrierDesigCode": "BG",
                                    "carrierName": "Biman Bangladesh Airlines"
                                },
                                "iatA_AircraftType": {
                                    "iatA_AircraftTypeCode": "738"
                                },
                                "rbd": "K",
                                "flightNumber": "389",
                                "segmentGroup": 1,
                                "returnJourney": true,
                                "airlinePNR": "SQOSET",
                                "technicalStopOver": null,
                                "duration": "165",
                                "cabinType": "Economy"
                            }
                        }
                    ],
                    "fareDetailList": [
                        {
                            "fareDetail": {
                                "baseFare": 16380,
                                "tax": 11907,
                                "otherFee": 0,
                                "discount": 0,
                                "vat": 142,
                                "currency": "BDT",
                                "paxType": "Adult",
                                "paxCount": 2,
                                "subTotal": 56858
                            }
                        },
                        {
                            "fareDetail": {
                                "baseFare": 12285,
                                "tax": 9907,
                                "otherFee": 0,
                                "discount": 0,
                                "vat": 111,
                                "currency": "BDT",
                                "paxType": "Child",
                                "paxCount": 1,
                                "subTotal": 22303
                            }
                        },
                        {
                            "fareDetail": {
                                "baseFare": 4095,
                                "tax": 3011,
                                "otherFee": 0,
                                "discount": 0,
                                "vat": 36,
                                "currency": "BDT",
                                "paxType": "Infant",
                                "paxCount": 1,
                                "subTotal": 7142
                            }
                        }
                    ],
                    "price": {
                        "totalPayable": {
                            "total": 86303,
                            "curreny": "BDT"
                        },
                        "gross": null,
                        "discount": {
                            "total": 0,
                            "curreny": "BDT"
                        },
                        "totalVAT": {
                            "total": 431,
                            "curreny": "BDT"
                        }
                    },
                    "penalty": {
                        "refundPenaltyList": [
                            {
                                "refundPenalty": {
                                    "departure": "DAC",
                                    "arrival": "BKK",
                                    "penaltyInfoList": [
                                        {
                                            "penaltyInfo": {
                                                "type": "Before Departure",
                                                "textInfoList": [
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Adult",
                                                            "info": [
                                                                "BDT 8340"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Child",
                                                            "info": [
                                                                "BDT 6351"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Infant",
                                                            "info": [
                                                                "BDT 2256"
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "penaltyInfo": {
                                                "type": "After Departure",
                                                "textInfoList": [
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Adult",
                                                            "info": [
                                                                "BDT 8340"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Child",
                                                            "info": [
                                                                "BDT 6351"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Infant",
                                                            "info": [
                                                                "BDT 2256"
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        "exchangePenaltyList": [
                            {
                                "exchangePenalty": {
                                    "departure": "DAC",
                                    "arrival": "BKK",
                                    "penaltyInfoList": [
                                        {
                                            "penaltyInfo": {
                                                "type": "Before Departure",
                                                "textInfoList": [
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Adult",
                                                            "info": [
                                                                "BDT 3710"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Child",
                                                            "info": [
                                                                "BDT 2833"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Infant",
                                                            "info": [
                                                                "Free Exchange allowed"
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "penaltyInfo": {
                                                "type": "After Departure",
                                                "textInfoList": [
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Adult",
                                                            "info": [
                                                                "BDT 3710"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Child",
                                                            "info": [
                                                                "BDT 2833"
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "textInfo": {
                                                            "paxType": "Infant",
                                                            "info": [
                                                                "Free Exchange allowed"
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "baggageAllowanceList": [
                        {
                            "baggageAllowance": {
                                "departure": "DAC",
                                "arrival": "BKK",
                                "checkIn": [
                                    {
                                        "paxType": "Adult",
                                        "allowance": "KG030"
                                    },
                                    {
                                        "paxType": "Infant",
                                        "allowance": "KG010"
                                    },
                                    {
                                        "paxType": "Child",
                                        "allowance": "KG030"
                                    }
                                ],
                                "cabin": [
                                    {
                                        "paxType": "Adult",
                                        "allowance": "SB"
                                    },
                                    {
                                        "paxType": "Infant",
                                        "allowance": "SB"
                                    },
                                    {
                                        "paxType": "Child",
                                        "allowance": "SB"
                                    }
                                ]
                            }
                        },
                        {
                            "baggageAllowance": {
                                "departure": "BKK",
                                "arrival": "DAC",
                                "checkIn": [
                                    {
                                        "paxType": "Adult",
                                        "allowance": "KG030"
                                    },
                                    {
                                        "paxType": "Infant",
                                        "allowance": "KG010"
                                    },
                                    {
                                        "paxType": "Child",
                                        "allowance": "KG030"
                                    }
                                ],
                                "cabin": [
                                    {
                                        "paxType": "Adult",
                                        "allowance": "SB"
                                    },
                                    {
                                        "paxType": "Infant",
                                        "allowance": "SB"
                                    },
                                    {
                                        "paxType": "Child",
                                        "allowance": "SB"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ],
            "paxList": [
                {
                    "ptc": "Adult",
                    "individual": {
                        "title": "Mr",
                        "givenName": "AHMED",
                        "surname": "ERFAN HABIB",
                        "gender": "Male",
                        "birthdate": "1985-03-04T00:00:00",
                        "nationality": "BANGLADESH",
                        "identityDoc": {
                            "identityDocType": "Passport",
                            "identityDocID": "PN444566",
                            "issuingCountryCode": "BD",
                            "expiryDate": "2029-10-09T00:00:00"
                        },
                        "associatePax": null,
                        "ticketDocument": null
                    },
                    "orderSSR": null
                },
                {
                    "ptc": "Adult",
                    "individual": {
                        "title": "Ms",
                        "givenName": "SHAMINA",
                        "surname": "MOHSINA ALI",
                        "gender": "Female",
                        "birthdate": "1985-03-06T00:00:00",
                        "nationality": "BANGLADESH",
                        "identityDoc": {
                            "identityDocType": "Passport",
                            "identityDocID": "PN123456",
                            "issuingCountryCode": "BD",
                            "expiryDate": "2029-09-09T00:00:00"
                        },
                        "associatePax": null,
                        "ticketDocument": null
                    },
                    "orderSSR": null
                },
                {
                    "ptc": "Child",
                    "individual": {
                        "title": "Miss",
                        "givenName": "ZAYANA",
                        "surname": "FATIMA AHMED",
                        "gender": "Female",
                        "birthdate": "2015-12-03T00:00:00",
                        "nationality": "BANGLADESH",
                        "identityDoc": {
                            "identityDocType": "Passport",
                            "identityDocID": "PN222222",
                            "issuingCountryCode": "BD",
                            "expiryDate": "2029-09-09T00:00:00"
                        },
                        "associatePax": null,
                        "ticketDocument": null
                    },
                    "orderSSR": null
                },
                {
                    "ptc": "Infant",
                    "individual": {
                        "title": "Miss",
                        "givenName": "ZUFRA",
                        "surname": "FATIMA AHMED",
                        "gender": "Female",
                        "birthdate": "2023-08-03T00:00:00",
                        "nationality": "BANGLADESH",
                        "identityDoc": {
                            "identityDocType": "Passport",
                            "identityDocID": "PN223222",
                            "issuingCountryCode": "BD",
                            "expiryDate": "2029-09-09T00:00:00"
                        },
                        "associatePax": {
                            "givenName": "SHAMINA",
                            "surname": "MOHSINA ALI"
                        },
                        "ticketDocument": null
                    },
                    "orderSSR": null
                }
            ],
            "contactDetail": {
                "phoneNumber": "990-091190987",
                "emailAddress": "karim@gmail.com"
            },
            "orderStatus": "OnHold",
            "orderChangeInfo": null,
            "partialPaymentInfo": {
                "totalPayableAmount": 86303,
                "minimumPayableAmount": 35122,
                "paidAmount": null,
                "dueAmount": 51181,
                "currency": "BDT",
                "dueDate": "2024-06-15T21:26:39.7316828"
            }
        }
    };
}