let express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  request = require("request-promise"),
  yahooFinance = require("yahoo-finance");
const APIKEY = "KAZP88DTWXJZJTY5";
const baseUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let stockList = [
  //"VMRGX",
  "NYSE:MDT"
];
// YYYY-MM-DD

let startDate = "2017-09-05";

let endDate = "2017-09-20";


yahooFinance.historical({
  symbols: stockList,
  from: startDate,
  to: endDate,
  period: 'd'
}).then(function (result) {
  console.log(result);
});

// mongoose.connect("mongodb://localhost/stocks");


// // schema setup
// let stockSchema = {
//   name: String,
//   open: String,
//   close: String,
// };



// mongoose.model("Stock", stockSchema);




// let stockData = []; // [{}, {}, {}]

// function getStockData(stock) {
  
// }





// app.use(bodyParser.urlencoded({ extended: true }));

// app.set("view engine", "ejs");

// app.use(express.static("public"));

// app.get("/", function(req, res) {
//   Stock.find({}, function(err, stock) {
//     if(err) {
//       console.log(err);
//     } else {
//       res.render("home", {data: stock});
//     }
//   });
  
// });

// app.post("/", function(req, res) {
  
//   res.redirect("/");
// })



// start req/res cycle
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started");
})
