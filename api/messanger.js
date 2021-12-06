/**
 * WebSocket messanger.
 * @param {*} usersList Список пользователей для аутентификации. 
 */
function Messanger(usersList) {
    let clients = {}
    let users = usersList;

    /**
     * Аутентификация пользователя.
     * @param {*} login Логин
     * @param {*} token Токен
     * @param {*} wsClient WebSocket клиент.
     * @returns Логин, или null при провале аутентификации.
     */
    const loginUser = (login, token, wsClient) => {
        if (users[login]?.token === token) {
            clients[login] = wsClient;
            return login;
        }
        return null;
    }

    /**
     * Отправка сообщения польозователю по WebSocket.
     * @param {*} login 
     * @param {*} data 
     * @param {*} event 
     */
    this.notifyUser = (login, data, event = 'notify') => {
        clients[login]?.send(JSON.stringify({ command: event, data: data, error: null }));
    }

    /**
     * конструктор менеджера WebSocket подключения.
     * @param {*} commandsList Список комманд.
     * @returns Менеджер WebSocket подключения.
     */
    this.getConnectionManager = (commandsList = {}) => {
        let login = null;
        let interval = null;

        /**
         * Тест WebSocket.
         * @param {*} callback 
         */
        const startSpam = async (callback) => {
            interval = setInterval(callback, 1000);
        }

        return (wsClient) => {
            
            /**
             * Проверяет аутентификацию пользователя, при успехе выполняет callback.
             * @param {*} callback 
             * @param  {...any} args Аргументы, которые передаются в callback.
             */
            const checkUser = (callback, ...args) => {
                login
                    ? callback?.(...args)
                    : wsClient.send(JSON.stringify({ command:'', data: null, error: 'You are not authorized. Send LOGIN command before.' }))
            }

            commands = {
                /**
                 * Тестовая команда эхо.
                 */
                'ECHO': (data, wsClient) => wsClient.send(JSON.stringify({ command: 'notify', data: data, error: null })),

                /**
                 * Тестовые команды отправки запросов клиенты. 
                 */
                'SPAM': (data, wsClient) => checkUser(startSpam, () => wsClient.send("IT'S A SPAM!")),
                'NOTSPAM': (data, wsClient) => clearInterval(interval),

                /**
                 * Команда аутентификации пользователя. 
                 */
                'LOGIN': (data, wsClient) => {
                    login = loginUser(data.login, data.token, wsClient);
                            wsClient.send(
                                login
                                    ? JSON.stringify({ command: 'notify', data: 'Hi ' + data.login, error: null })
                                    : JSON.stringify({ command: 'notify', data: null, error: 'Not authorized' })
                            )
                },
                ...commandsList
            };

            /**
             * Событие закрытия соедининия.
             */
            wsClient.on('close', () => {
                clearInterval(interval);
                delete clients[login];
            });

            /**
             * События получения сообщения от пользователя.
             */
            wsClient.on('message', (messageText) => {
                try {
                    let message = JSON.parse(messageText)
                    commands[message.command]
                        ? commands[message.command](message.data, wsClient)
                        : wsClient.send(JSON.stringify({ command: 'notify', data: null, error: "Unknown command: " + message.command }));
                }
                catch (e) {
                    wsClient.send(JSON.stringify({ command: 'notify', data: null, error: 'Wrong message! ' + e }));
                }
            });
        }
    }
}

module.exports = Messanger;