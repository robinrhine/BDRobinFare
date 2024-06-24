const express = require('express');
const router = express.Router();
const {SearchFlightsInputs,TestSearchFlightsInputs} = require('./Flight_Search_Router');
const {SearchFareRules} = require('./Fare_Rules_Router');
const {SearchMiniRule} = require('./Mini_Rule_Router');
const {OfferPriceInputs} = require('./Offer_Price_Router');
const {OrderSellInputs} = require('./Order_Sell_Router');
const {OrderCreateInputs,TestOrderCreateOutputs} = require('./Order_Create_Router');
const {OrderRetrieveInputs} = require('./Order_Retrieve_Router');
const {OrderReshopPriceInputs} = require('./Order_ReshopPrice_Router');
const {OrderCancelInputs} = require('./Order_Cancel_Router');
const {OrderChangeInputs} = require('./Order_Change_Router');
const {SearchBalance} = require('./Get_Balance_Router');
// to search flight from user input parameters....
// Step 1 to get Flight list first.
router.post('/SearchFlight',SearchFlightsInputs); // activate later for realtime test.
//router.post('/SearchFlight',TestSearchFlightsInputs); // need to deactivate late after testing done.
router.post('/FareRules',SearchFareRules);
router.post('/MiniRules',SearchMiniRule);
router.post('/OfferPrice',OfferPriceInputs);
router.post('/OrderSell',OrderSellInputs);
router.post('/OrderCreate',OrderCreateInputs);  // need to activate later.
//router.post('/OrderCreate',TestOrderCreateOutputs); // need to deactivate later.
router.post('/OrderRetrieve',OrderRetrieveInputs);
router.post('/OrderReshopPrice',OrderReshopPriceInputs);
router.post('/OrderCancel',OrderCancelInputs);
router.post('/OrderChange',OrderChangeInputs);
router.get('/GetBalance',SearchBalance);


module.exports = router;