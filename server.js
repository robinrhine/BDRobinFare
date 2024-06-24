const express = require("express");
if(process.env.NODE_ENV !=="PROD"){
    require('dotenv').config();
}

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.json('Hello World');
});

//import routes for SearchFlight.
const flightSearch = require('./Routes/Index');
app.use('/api/V1/FL',flightSearch);

const PORT = process.env.PORT || 5000; 


app.listen(PORT,()=>{
    console.log(`server is running on port:${PORT}`);
    console.log(process.env.DEV_URL);
});