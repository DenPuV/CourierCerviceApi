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
app.use('/auth/user', qs.loginator.checkRole("user"));
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

app.get("/auth/admin/order", qs.rest.getOrders);
app.get("/auth/admin/order/:id", qs.rest.getOrders);
app.put("/auth/admin/order/:contactId", qs.rest.putOrder);
app.delete("/auth/admin/order/:id", qs.rest.cancelOrder);

app.get("/auth/admin/package", qs.rest.getPackages);
app.get("/auth/admin/package/:id", qs.rest.getPackages);
app.delete("/auth/admin/package/:id", qs.rest.deletePackage);
app.put("/auth/admin/package/:orderId", qs.rest.putPackage);

app.get("/auth/admin/route", qs.rest.getRoutes);
app.get("/auth/admin/route/:id", qs.rest.getRoutes);
app.put("/auth/admin/route/:orderId", qs.rest.putRoute);

app.get("/auth/admin/contact", qs.rest.getContacts);
app.get("/auth/admin/contact/:id", qs.rest.getContacts);
app.put("/auth/admin/contact", qs.rest.putContact);
app.patch("/auth/admin/contact/:id", qs.rest.patchContact);
app.delete("/auth/admin/contact/:id", qs.rest.deleteContact);

app.post("/register", qs.loginator.register);
app.post("/login", qs.loginator.login);
app.get("/logout", qs.loginator.logout);

/**
 * Запуск приложения.
 */
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});