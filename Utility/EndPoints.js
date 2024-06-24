const onRetrieveEndPoints =(key)=>{

    // key is maintained based api flow for BDfare

        let  endPoints={
            flight_search:"AirShopping",
            offer_price:"OfferPrice",
            fare_rules:"FareRules",
            mini_rules:"MiniRule",
            order_sell:"OrderSell",
            order_create:"OrderCreate",
            order_retrieve:"OrderRetrieve",
            order_cancel:"OrderCancel",
            order_reshop_price:"OrderReshopPrice",
            order_change:"OrderChange",
            get_balance:"GetBalance"
            
        }

        return endPoints[key];
       
        
    }
    
    module.exports ={onRetrieveEndPoints};