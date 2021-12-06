const { request, response, query } = require('express');
const { result } = require('lodash');
const { v4: uuidv4 } = require('uuid');

const isError = (error, response) => {
    if (error) {
        response.sendStatus(500);
        return true;
    }
    return false;
}

function rest(pool) {
    this.getContacts = (request, response) => {
        let query = `SELECT * FROM "contact"`;
        if (request.params.id) {
            query += ` WHERE "id" = '${request.params.id}'`;
        }

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.status(200).json(result.rows);
        });
    }

    this.putContact = (request, response) => {
        let contact = request.body;
        if (!contact.firstName || !contact.secondName) {
            response.sendStatus(400);
            return;
        }
        let query = `INSERT INTO "contact"("id", "firstName", "secondName", "email", "phone")`
            + ` VALUES('${uuidv4()}', '${contact.firstName}', '${contact.secondName}'`
            + `, ${contact.email ? `'${contact.email}'` : null}, '${contact.phone ? `${contact.phone}` : null}')`;

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.sendStatus(200);
        });
    }

    this.patchContact = (request, response) => {
        let contact = request.body;
        let addAnd = false;
        let query = `UPDATE "contact" SET `;
        
        if (contact.firstName) {
            query += `"firstName" = '${contact.firstName}' `;
            addAnd = true;
        }
        if (contact.secondName) {
            if (addAnd) query += ", "
            query += `"secondName" = '${contact.secondName}' `;
            addAnd = true;
        }
        if (contact.email) {
            if (addAnd) query += ", "
            query += `"email" = '${contact.email}' `;
            addAnd = true;
        }
        if (contact.phone) {
            if (addAnd) query += ", "
            query += `"phone" = '${contact.phone}' `;
            addAnd = true;
        }
        query += `WHERE "id" = '${request.params.id}'`

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.sendStatus(200);
        });
    }

    this.deleteContact = (request, response) => {
        let query = `UPDATE "contact" SET "deleted" = 'true' WHERE "id" = '${request.params.id}'`;
        pool.query(query, (error, result) => {
            if (isError(error, response)) return;
            response.sendStatus(200);
        });
    }

    this.getOrders = (request, response) => {
        let query = `SELECT * FROM "order"`;
        if (request.params.id) {
            query += ` WHERE "id" = '${request.params.id}'`;
        }

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.status(200).json(result.rows);
        })
    }

    this.putOrder = (request, response) => {
        let contactId = request.params.contactId;
        let id = uuidv4();
        let query = `INSERT INTO "order" ("id", "contactId") VALUES ('${id}', '${contactId}')`

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.status(200).json({orderId: id});
        })
    }

    this.cancelOrder = (request, response) => {
        let query = `UPDATE "order" SET "statusId" = (SELECT "id" FROM "status" WHERE "code" = 'cancelled')`;
        if (request.params.id) {
            query += ` WHERE "id" = '${request.params.id}'`;
        }

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.sendStatus(200);
        })
    }

    this.getPackages = (request, response) => {
        let query = `SELECT * FROM "package"`;
        if (request.params.id) {
            query += ` WHERE "id" = '${request.params.id}'`;
        }

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;
            
            response.status(200).json(result.rows);
        });
    }

    this.deletePackage = (request, response) => {
        let query = `DELETE FROM "package" WHERE "id" = '${request.params.id}'`;

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;
            
            response.sendStatus(200);
        });
    }

    this.putPackage = (request, response) => {
        let orderId = request.params.orderId;
        let package = request.body;
        if (!package.weight) {
            response.sendStatus(400);
            return;
        }

        let query = `INSERT INTO "package" ("id", "weight", "description", "orderId") VALUES `
            + `('${uuidv4()}', '${package.weight}', ${package.description ? `'${package.description}'` : null}, '${orderId}')`;

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;
            
            response.sendStatus(200);
        });
    }

    this.getRoutes = (request, response) => {
        let query = `SELECT * FROM "route"`;
        if (request.params.id) {
            query += ` WHERE "id" = '${request.params.id}'`;
        }

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.status(200).json(result.rows);
        });
    }

    this.putRoute = (request, response) => {
        let orderId = request.params.orderId;
        let route = request.body;
        if(!route.from || !route.to) {
            response.sendStatus(400);
            return;
        }
        let query = `INSERT INTO "route" ("id", "orderId", "from", "to") `
            + `VALUES ('${uuidv4()}', '${orderId}', '${route.from}', '${route.to}') `
            + `ON CONFLICT ("orderId") DO UPDATE `
            + `SET "from" = '${route.from}', "to" = '${route.to}'`;

        pool.query(query, (error, result) => {
            if (isError(error, response)) return;

            response.sendStatus(200);
        });
    }
}

module.exports = rest;