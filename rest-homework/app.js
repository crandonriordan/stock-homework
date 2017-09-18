let express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    googleFinance = require("google-finance"),
    request = require("request"),
    methodOverride = require("method-override"),
    app = express();

const APIKEY = "KAZP88DTWXJZJTY5";
const baseUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// mongodb
let Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/stock");

let stockSchema = new mongoose.Schema({
    name: String,
    open: String,
    close: String
});

let Stock = mongoose.model("Stock", stockSchema);

//INDEX
app.get("/", function(req, res) {
    res.redirect("/stocks");
});

app.get("/stocks", function(req, res) {
    Stock.find({}, function(err, stocks) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", { stocks: stocks });
        }
    })
});

//NEW
app.get("/stocks/new", function(req, res) {
    res.render("new");
});

//create

app.post("/stocks/:id", function(req, res) {
    console.log("post")
    let name = req.body.name;
    let url = baseUrl + name + "&apikey=" + APIKEY;
    request(url, function(error, response, body) {
       if(!error && response.statusCode == 200) {
            let parsedData = JSON.parse(body);
            let mostRecent = Object.keys(parsedData["Weekly Time Series"])[0];
            let recentData = parsedData["Weekly Time Series"][mostRecent];
            //create stock following schema
            Stock.create({
                name: name,
                open: recentData["1. open"],
                close: recentData["4. close"]
            }, function(err, stock) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(stock)
                    res.redirect("/stocks");
                }
            });
       } else {
           console.log("error with request")
           console.log(error)
       }
    });
});

//update
app.put("/stocks/:id", function(req, res) {
    console.log(req.params);
    let id = req.params.id;
     //find and update with new request
    Stock.findById(id, function(err, stock) {
        if(err) {
            console.log(err);
        } else {
            let name = stock.name;
            // request update
            let url = baseUrl + name + "&apikey=" + APIKEY;
            request(url, function(error, response, body) {
               if(!error && response.statusCode == 200) {
                    let parsedData = JSON.parse(body);
                    let mostRecent = Object.keys(parsedData["Weekly Time Series"])[0];
                    let recentData = parsedData["Weekly Time Series"][mostRecent];
                    stock.open = recentData["1. open"];
                    stock.close = recentData["4. close"];
                    stock.save(function(err, stock){
                        if(err) {
                            console.log("Err with updating");
                            console.log(err);
                        }
                    });
               } 
            });
            console.log(stock);
            res.redirect("/stocks");
        }
    });
});

//delete
app.delete("/stocks/:id", function(req, res) {
   let id = req.params.id;
   Stock.findByIdAndRemove(id, function(err, stock) {
      if(err) {
          console.log(err); 
      } else {
          res.redirect("/stocks");
          console.log("Removed");
          console.log(stock);
      }
   });
});




app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started");
});