const express = require("express");
const expressLayouts = require("express-ejs-layouts");
// const modelConfig = require("./util/model-config");
const {requestLogger, isAuth} = require("./middleware");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const path = require("path");

const MONGODB_URI = "mongodb+srv://merlin:superpassword@cluster0.v3bio.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0"

// Create MongoDB session store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    expires: 1000 * 60 * 60 * 24 // 1 day
});

store.on("error", function(error) {
    console.log("Session store error:", error);
});

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");
app.use(expressLayouts);

// Session middleware
app.use(session({
    secret: 'supersecret-key-for-IS5750-final',
    resave: true,
    saveUninitialized: true, 
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || {};
    res.locals.isAdmin = req.session.user?.roles?.includes('admin') || false;
    res.locals.flashMessages = req.flash();
    next();
});


app.use(requestLogger);

//controllers
const errorController = require("./controllers/error-controller");

// Routes
const homeRoute = require("./routes/home-route");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");
const apiRoutes = require("./routes/api-routes");

app.use("/", homeRoute);
app.use("/about", homeRoute);
app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/courses", courseRoutes);  
app.use("/contacts", contactRoutes);
app.use("/auth", userRoutes);
app.use("/api", apiRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        console.log("Connected to MongoDB");
        return app.listen(3000);
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });