using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Websocket.Client;

namespace ApiProviderLibrary
{
    public class WebSocketClient: IDisposable
    {
        public event Action<WebSocketMessage> OnWebsocketMessage;
        public event Action<string> OnWebsocketWarning;
        private WebsocketClient client;

        public WebSocketClient(string url)
        {
            client = CreateClient(url);
        }

        private WebsocketClient CreateClient(string url)
        {
            var client = new WebsocketClient(new Uri(url));
            client.ReconnectTimeout = TimeSpan.FromSeconds(30);
            client.ReconnectionHappened.Subscribe(
                info => OnWebsocketWarning?.Invoke($"Переподключение websocket: {info.Type}")
            );
            client.MessageReceived.Subscribe(
                message =>
                {
                    var wsMessage = WebSocketMessage.GetMessage(message.Text);
                    if (String.IsNullOrEmpty(wsMessage.Error))
                        switch (wsMessage.Command)
                        {
                            default: OnWebsocketMessage?.Invoke(wsMessage); break;
                        }
                    
                    else
                        OnWebsocketWarning?.Invoke($"Ошибка websocket: {wsMessage.Error}");
                }
            );
            client.Start();

            return client;
        }

        public void SendMessage(string message)
        {
            client?.Send(message);
        }

        public void Dispose()
        {
            if (client != null) client.Dispose();
        }
    }
}
