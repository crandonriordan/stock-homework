let express = require("express"),
    bodyParser = require("body-parser"),
    googleFinance = require("google-finance");
    
let app = express();


let SYMBOLS = [
  'NASDAQ:AAPL',
  'NASDAQ:GOOGL',
  'NASDAQ:MSFT',
  'NASDAQ:YHOO',
  'NYSE:IBM',
  'NYSE:TWTR'
];

let startDate = "2017-09-04";
let endDate = "2017-09-08";

googleFinance.historical({
    symbols: SYMBOLS,
    from: startDate,
    to: endDate
}).then(function(result) {
    console.log(result);
})
