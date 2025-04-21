const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const modelConfig = require("./util/model-config");
const requestLogger = require("./middleware");

const path = require("path");

const app = express();

app.use(requestLogger);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: 'supersecret-key-for-IS5750-midterm',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true
    }
}));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session?.isLoggedIn || false;
    res.locals.username = req.session?.username || null;
    next();
});

// Routes
const homeRoute = require("./routes/home-route");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");

app.use("/", homeRoute);
app.use("/about", homeRoute);
app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/courses", courseRoutes);  
app.use("/contacts", contactRoutes);
app.use("/auth", userRoutes);

modelConfig.configModelRelations();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
