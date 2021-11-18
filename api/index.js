const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/schema.js');
const qs = require("./queries");

const app = express();
const port = 3000;

const messanger = new (require('./messanger'))(qs.loginator.getUsers());
qs.events.onOrderStatusUpdated = (login) => {
    messanger.notifyUser(login, "Order status updated");
};
const webSocket = require("ws");
const wsServer = new webSocket.Server({port: 9000});
wsServer.on('connection', messanger.getConnectionManager());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(cookieParser("MemeRadioSecret"));
app.use('/auth', qs.loginator.checkUser);
app.use('/auth/admin', qs.loginator.checkRole("admin"));
app.use('/auth/graphql', graphqlHTTP((req) => {
    schema.context = req;
    return {
        schema: schema,
        graphiql: true
    }
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/www/index.html");
});
app.get("/www/*", (req, res) => {
  let options = {
    root: __dirname,
    dotfiles: "deny"
  }

  res.sendFile(req.url, options, (err) => {
    if (err) {
      res.sendStatus(err.status);
    }
  });
});

// app.get(('/', (request, response) => {  }))
app.post("/register", qs.loginator.register);
app.post("/login", qs.loginator.login);
app.get("/logout", qs.loginator.logout);

// Authorized requests.
//app.use(qs.checkUser);
app.get("/auth/checkLogin", (req, res) => {
    res.status("200").json({ status: `You are ${req.cookies.login}` });
});
app.get("/auth/admin/test", (req, res) => {
    res.status("200").json({status: "OK"});
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});