using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ApiProviderLibrary
{
    public class WebSocketMessage
    {
        public static WebSocketMessage GetMessage(string raw)
        {
            var message = new WebSocketMessage();

            try
            {
                dynamic messageJson = JObject.Parse(raw);
                message.Command = messageJson.command;
                message.Data = messageJson.data;
                message.Error = messageJson.error;
            }
            catch (Exception ex)
            {
                message.Command = "error";
                message.Data = "";
                message.Error = ex.Message;
            }

            return message;
        }

        public string Command { get; set; }
        public string Data { get; set; }
        public string Error { get; set; }

        public override string ToString()
        {
            return "{\"command\": "
                + $"\"{Command}\","
                + "\"data\": "
                + $"\"{Data}\""
                + "}";
        }
    }
}
