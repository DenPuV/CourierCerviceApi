require('dotenv').config();
const events = require('./eventKeeper')

const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const Pool = require('pg').Pool;
const { request, response } = require("express");
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
const loginator = new (require("./loginator")).loginator(pool);
loginator.syncUsers();

/**
 * Запрос к бд.
 * @param {*} text 
 * @returns 
 */
const query = async (text) => {
    try {
        const { rows } = await pool.query(text);
        return rows;
    }
    catch (error) {
        throw error;
    }
}

/**
 * Запрос заказов контакта по id.
 * @param {*} contactId 
 * @returns 
 */
const getOrdersByContactId = (contactId) => {
    return query(`SELECT * FROM "order" WHERE "contactId" = '${contactId}'`);
}

/**
 * Запрос заказов пользователя по логину.
 * @param {*} login 
 * @returns 
 */
const getOrdersByLogin = (login) => {
    return query(`SELECT * FROM "order" WHERE "contactId" = `
    + `(SELECT c."id" FROM "contact" c JOIN "user" u ON (c."userId" = u."id") WHERE u."login" = '${login}')`);
}

/**
 * Запорс добавления заказа пользователя.
 * @param {*} login Логин пользователя.
 * @returns 
 */
const newOrder = (login) => {
    let id = uuidv4();
    try {
        await query(
            `INSERT INTO "order"("id", "contactId")`
            + `SELECT '${id}', c."id" FROM "contact" c JOIN "user" u ON (c."userId" = u."id") WHERE u."login" = '${login}'`
            )
        return id;
    }
    catch (error) {
        return error;
    }
}

/**
 * Запрос добавления маршрута заказа.
 * @param {*} orderId Id заказа.
 * @param {*} route Объект м данными маршрута.
 */
const addRoute = (orderId, route) => {
    pool.query(`INSERT INTO "route" ("id", "from", "to", "orderId")`
        + ` VALUES ('${uuidv4()}', '${route.from}', '${route.to}', '${orderId}')`);
}

/**
 * Запрос добавления посылок к заказу.
 * @param {*} packages Массив объектов посылок.
 * @returns Массив объектов посылок.
 */
const addPackages = (packages) => {
    let first = true;
    let text = `INSERT INTO "package" ("id", "weight", "description", "orderId") VALUES `
    packages.forEach(package => {
        package.id = uuidv4();
        first
            ? first = false
            : text += ",";
        text += `('${package.id}', '${package.weight}', '${package.description}', '${package.orderId}')`;
    });
    let answer = await query(text);
    return packages;
}

/**
 * Запрос логина пользователя заказа.ПЕРЕПИСТЬ
 * @param {*} orderId Id заказа.
 * @param {*} callback 
 */
const getOrderUserLoginAsync = (orderId, callback) => {
    let text = `SELECT "login" FROM "user" u`
        + ` JOIN "contact" c ON (u."id" = c."userId")`
        + ` JOIN "order" o ON (c."id" = o."contactId")`
        + ` WHERE o."id" ='${orderId}'`;
    pool.query(text, callback);
}

/**
 * Запрос изменения статуса заказа.
 * @param {*} orderId Id заказа.
 * @param {*} statusCode Код нового статуса.
 * @returns Код нового статуса.
 */
const setOrderStatus = async (orderId, statusCode) => {
    let text = `UPDATE "order" SET "statusId" = (SELECT "id" FROM "status" WHERE "code" = '${statusCode}') WHERE "id" = '${orderId}'`
    await query(text);
    getOrderUserLoginAsync(orderId, (error, result) => {
        if (!error) {
            events.rise('orderStatusUpdated', result.rows?.[0]?.login, orderId);
        }
    });
    return statusCode;
}

module.exports = {
    loginator: loginator,
    getOrdersByContactId: getOrdersByContactId,
    getOrdersByLogin: getOrdersByLogin,
    addRoute: addRoute,
    newOrder: newOrder,
    addPackages: addPackages,
    setOrderStatus: setOrderStatus,
    query: query,
    events: events
};