using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;

namespace ApiProviderLibrary
{
    public class ApiProvider
    {
        private string _url;

        public ApiProvider(string url = "http://localhost:3000")
        {
            _url = url;
        }

        private CookieContainer _cookies = new CookieContainer();
        
        public WebSocketClient Client { get; private set; }
        public string Login { get; private set; }
        public string Token { get; private set; }

        /// <summary>
        /// Выполняет вход в систему.
        /// </summary>
        /// <param name="login">Имя пользователя.</param>
        /// <param name="password">Пароль.</param>
        public async Task<dynamic> LoginAsync(string login, string password)
        {
            var response = await GetWebResponseDynamicAsync("/login",
                "{\"login\":\"" + login + "\",\"password\":\"" + password + "\"}",
                "POST"
            );

            GetAuthCookies();

            return response;
        }

        private void GetAuthCookies()
        {
            foreach (Cookie cookie in _cookies.GetCookies(new Uri(_url)))
            {
                if (cookie.Name == "login") Login = cookie.Value;
                if (cookie.Name == "token") Token = cookie.Value;
            }
        }

        public Task<string> GetOrders()
        {
            return GetWebResponseAsync("/auth/admin/order");
        }

        public Task<string> GetGraphqlData(string query) 
        {
            var graphqlQuery = JsonConvert.SerializeObject(new GraphQLquery(query));
            return GetWebResponseAsync("/auth/graphql", graphqlQuery, "POST");
        }

        public async Task<dynamic> GetWebResponseDynamicAsync(string uri, string body = null, string method = "GET")
        {
            return JObject.Parse(await GetWebResponseAsync(uri, body, method));
        }

        /// <summary>
        /// Выполняет веб запрос.
        /// </summary>
        /// <param name="uri">URI.</param>
        /// <param name="body">Тело запроса.</param>
        /// <param name="method">Метод запроса.</param>
        /// <returns>Newtonsoft json объект ответа на запрос.</returns>
        public async Task<string> GetWebResponseAsync(string uri, string body = null, string method = "GET")
        {
            var requestUri = _url + uri;
            var request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = method;
            request.Accept = "application/json";
            request.ContentType = "application/json";
            request.CookieContainer = _cookies;

            if (!string.IsNullOrEmpty(body))
            {
                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    await streamWriter.WriteAsync(body);
                }
            }

            try
            {
                var responseString = string.Empty;
                var httpWebResponse = (HttpWebResponse)request.GetResponse();
                using (var responseStream = httpWebResponse.GetResponseStream())
                {
                    var reader = new StreamReader(responseStream, Encoding.UTF8);
                    responseString = await reader.ReadToEndAsync();
                }

                return responseString;
            }
            catch (WebException ex)
            {
                throw new InvalidOperationException("Не удалось выполнить запрос. " + ex.Message, ex);
            }
        }

        public void ConnectWebSocket()
        {
            if (Client is null) Client = new WebSocketClient("ws://localhost:9000");
        }

        public void CloseWebSocket()
        {
            if (Client != null) Client.Dispose();
        }
    }
}
