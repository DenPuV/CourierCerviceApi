const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/schema.js');
const qs = require("./queries");

/**
 * Настройка express приложения
 */
const app = express();
const port = 3000;

/**
 * Настройки мессенджера.
 */
const messanger = new (require('./messanger'))(qs.loginator.getUsers());
qs.events.on('orderStatusUpdated', (login, orderId) => {
    messanger.notifyUser(login, {message: "Order status updated", orderId: orderId});
});

/**
 * Настройка WebSocket приложения.
 */
const webSocket = require("ws");
const wsServer = new webSocket.Server({port: 9000});
wsServer.on('connection', messanger.getConnectionManager());

/**
 * Настройка промежуточного промежуточного слоя express приложения. 
 */
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(cookieParser("CourierServiceSecret"));
app.use('/auth', qs.loginator.checkUser);
app.use('/auth/admin', qs.loginator.checkRole("admin"));
app.use('/auth/graphql', graphqlHTTP((req) => {
    schema.context = req;
    return {
        schema: schema,
        graphiql: true
    }
}));

/**
 * Настройка роутинга приложения.
 */
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

app.post("/register", qs.loginator.register);
app.post("/login", qs.loginator.login);
app.get("/logout", qs.loginator.logout);

/**
 * Запуск приложения.
 */
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});