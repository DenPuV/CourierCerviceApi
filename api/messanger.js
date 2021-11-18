function Messanger(usersList) {
    let clients = {}
    let users = usersList;

    const loginUser = (login, token, wsClient) => {
        if (users[login]?.token === token) {
            clients[login] = wsClient;
            return login;
        }
        return null;
    }

    this.notifyUser = (login, data, event = 'notify') => {
        clients[login]?.send(JSON.stringify({ event: event, data: data, error: null }));
    }

    this.getConnectionManager = (commandsList = {}) => {
        let login = null;
        let interval = null;

        const startSpam = async (callback) => {
            interval = setInterval(callback, 1000);
        }

        return (wsClient) => {
            
    
            const checkUser = (callback, ...args) => {
                login
                    ? callback?.(...args)
                    : wsClient.send(JSON.stringify({ data: null, error: 'You are not authorized. Send LOGIN command before.' }))
            }

            commands = {
                'ECHO': (data, wsClient) => wsClient.send(JSON.stringify({ event: 'notify', data: data, error: null })),
                'SPAM': (data, wsClient) => checkUser(startSpam, () => wsClient.send("IT'S A SPAM!")),
                'NOTSPAM': (data, wsClient) => clearInterval(interval),
                'LOGIN': (data, wsClient) => {
                    login = loginUser(data.login, data.token, wsClient);
                            wsClient.send(
                                login
                                    ? JSON.stringify({ event: 'notify', data: 'Hi ' + data.login, error: null })
                                    : JSON.stringify({ event: 'notify', data: null, error: 'Not authorized' })
                            )
                },
                ...commandsList
            };

            wsClient.on('close', () => {
                clearInterval(interval);
                delete clients[login];
            });
            wsClient.on('message', (messageText) => {
                try {
                    let message = JSON.parse(messageText)
                    commands[message.command]
                        ? commands[message.command](message.data, wsClient)
                        : wsClient.send(JSON.stringify({ event: 'notify', data: null, error: "Unknown command" }));
                }
                catch (e) {
                    wsClient.send(JSON.stringify({ event: 'notify', data: null, error: 'Wrong message! ' + e }));
                }
            });
        }
    }
}

module.exports = Messanger;