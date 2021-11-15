const { request, response } = require("express");
const passwordHash = require("password-hash");
const {
    v4: uuidv4,
    v1: uuidv1,
} = require('uuid');

/**
 * Loginator
 * @param {*} pgPool DB pool.
 */
function loginator(pgPool){
    if (!pgPool){
        throw {error: "DB pool required."}
    }

    let users = {};
    let pool = pgPool;

    /**
     * Синхронизирует пользователей из базы данных.
     */
    this.syncUsers = async () => {
        let query = `SELECT u.login, u.id, uk.token FROM "userTokenMap" as uk JOIN "user" as u ON(u.id = uk."userId")`
        console.log("Syncing users tokens");
        pool.query(query, (error, result) => {
            if (error) console.log("Cannot sync users tokens\n" + error)
            else {
                result.rows.forEach(async item => {
                    users[item.login] = {};
                    users[item.login].token = item.token;
                    users[item.login].roles = await getRoles(item.login);
                });
                console.log(`Users tokens syncing finished\nSynced ${Object.keys(users).length} users tokens`);
            }
        });
    };

    const getRoles = async (login) => {
        let roles = await pool.query(
            `SELECT ur.code FROM "userRole" ur JOIN "userRoleMap" urm ON (ur.id = urm."roleId")`
            + `JOIN "user" u ON (u.id = urm."userId")`
            + `WHERE u.id = (SELECT "id" FROM "user" WHERE "login" = '${login}' LIMIT 1)`
        );
        return roles.rows;
    }

    this.checkUser = (request, response, next) => {
        const user = {
            login: request.cookies.login,
            token: request.cookies.token
        }
        if(users[user.login] && user.token && users[user.login].token === user.token){
            next();
        }
        else{
            response.sendStatus("401");
        }
    }

    /**
     * Сверяет пароль пользователя и добавляет новую запись токена.
     */
    this.login = (request, response) => {
        const user = request.body;
        let query = `SELECT id FROM "user" WHERE login = '${user.login}' AND deleted != true`;
        pool.query(query, (error, result) => {
            if (error) response.sendStatus("400")
            else {
                if (result.rows.length < 1 || passwordHash.verify(user.password, result.rows[0].passwordhash)) response.sendStatus("401")
                else {
                    let userkey = uuidv4();
                    pool.query(`INSERT INTO "userTokenMap" ("userId", token) VALUES ('${result.rows[0].id}', '${userkey}')`, async (err, res) => {
                        if (err) response.sendStatus("400");
                        else {
                            response.cookie('login', user.login);
                            response.cookie('token', userkey);
                            users[user.login].token = userkey;
                            users[user.login].roles = await getRoles(user.login);
                            response.sendStatus('200');
                        }
                    });
                }
            };
        })
    };

    /**
     * Удаляет из бд запись токена пользователя.
     */
    this.logout = (request, response) => {
        const login = request.cookies.login;
        let query = `DELETE FROM "userTokenMap" WHERE "userId" = (SELECT id FROM "user" WHERE login = '${login}')`;
        pool.query(query, (error) => {
            if (error) response.sendStatus("400");
            else {
                response.cookie("login", '');
                response.cookie("token", '');
                delete users[login];
                response.sendStatus("200");
            };
        });
    };

    /**
     * Добавляет в бд нового пользователя.
     */
    this.register = (request, response) => {
        const user = request.body;
        let query = `INSERT INTO "user" (id, login, password) VALUES ('${uuidv4()}', '${user.login}', '${passwordHash.generate(user.password)}')`;
        pool.query(query, (error, result) => {
            if (error) response.sendStatus("400")
            else {
                this.login(request, response);
            }
        });
    };

    this.checkRole = (roleCode) => {
        return (request, response, next) => {
            const login = request.cookies.login;
            if(users[login]?.roles?.some((role) => role.code === roleCode)){
                next();
            }
            else{
                response.sendStatus("401");
            }
        }
    }
}

module.exports = {
    loginator
};