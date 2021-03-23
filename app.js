const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function(req, res) {
    
    let day = date();   //Code is in date.js
    
    res.render("list", {listTitle: day, newItem: items});
});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    
    if(req.body.list === "Work")
    {
        workItems.push(item);
        res.redirect("/work");
    }

    else
    {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newItem: workItems});
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, function() {
    console.log("Server listening to port 3000");
});