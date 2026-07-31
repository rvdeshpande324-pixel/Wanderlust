const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utills/wrapAsync.js");
const ExpressError = require("./utills/ExpressError.js");
const { listingSchema } = require("./schema.js");

const MONGO_DB = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_DB);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res) => {
    res.send("Hi I am root")
})

//Index Route

app.get("/listings", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

    }));
    
// New Route

app.get("/listings/new", async(req,res) => {
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", wrapAsync(async(req,res,next) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing!");
    }

    let{title, description, image, price, location, country} = req.body;
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));


//Show Route
app.get("/listings/:id", wrapAsync(async(req,res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        console.log(listing);
        res.render("listings/show.ejs", { listing });
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});

}));

//Update Route
app.put("/listings/:id", wrapAsync(async(req,res) => {
    if(!req.body.listings){
      throw new ExpressError(400, "Send valid data!");
    };
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res) => {
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
}));


/*app.get("/testListing", async(req,res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    })

    await sampleListing.save();
    console.log("Sample was saved");
})*/

app.all("/*splat", (req,res,next) => {
    next(new ExpressError(404, "Page not Found!"));
})

app.use((err,req,res,next) => {
    let {statusCode = 500, message ="Soething went wrong!"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", { message });
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})

