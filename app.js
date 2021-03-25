const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-raman:Test123@cluster0.qf4xt.mongodb.net/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to your todoList!"
});

const item2 = new Item ({
    name: "Hit the + button to add a new item."
});

const item3 = new Item ({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
    
    Item.find({}, function(err, foundItems) {

        if(foundItems.length === 0)
        {
            Item.insertMany(defaultItems, function(err) {
                if(err)
                    console.log(err);

                else
                    console.log("Successfully inserted default items to DB.");
            });
            res.redirect("/");
        }

        else
            res.render("list", {listTitle: "Today", newItem: foundItems});
    });
    
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err)
        {
            if(!foundList)
            {
                //Create a new list
                const list = new List ({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save(function() {
                    res.redirect("/" + customListName);
                });
            }
            
            else
            {
                //Show an existing list
                res.render("list", {listTitle: foundList.name, newItem: foundList.items});

            }
        }
    });
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item ({
        name: itemName
    });

    if(listName === "Today")
    {
        newItem.save(function() {
            res.redirect("/");
        });
    }
    else
    {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(newItem);
            foundList.save(function() {
                res.redirect("/" + listName);
            });
        });
    }

});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today")
    {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(err)
                console.log(err);
    
            else
            {
                console.log("Item deleted successfully");
                res.redirect("/");
            }
        });
    }

    else
    {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            if(!err)
                res.redirect("/" + listName);
        });
    }
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server listening to port 3000");
});