require('dotenv').config();
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

const query = async (text) => {
    try {
        const { rows } = await pool.query(text);
        return rows;
    }
    catch (error) {
        throw error;
    }
}

const getOrder = async (orderId) => {
    return query(`SELECT * FROM "order" WHERE id = '${orderId}'`);
}

const newOrder = async (login) => {
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

module.exports = {
    loginator: loginator,
    getOrders: getOrder,
    newOrder: newOrder,
    query: query
};