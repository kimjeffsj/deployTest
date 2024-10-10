const express = require("express");
const app = express();

const middlewareLogger = (req, res, next) => {
    console.log(`middlewareLogger ${req.path}`);
    next();
}

const middleware2 = (req, res, next) => {
    const queries = req.query;
    console.log(`middleware2 ${req.query}`);
    console.log(queries)
    if(queries != {}) {
        req.length = 1;
    }
    else {
        req.length = 10;
    }
    next();
}
app.use(middlewareLogger);
app.use(middleware2);

const validateAdmindUser = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.send("You are not authorized");
    }
    next();
}

app.get("/", (req, res) => {
    console.log(req.length)
    res.send("Welcome to our API")
});

app.post("/books", validateAdmindUser, (req, res) => {
    // logic for creating
    console.log("This is only for admins");
    res.send("This is only for admins");
});

app.listen(3000, () => { console.log("Listening on 3000") })