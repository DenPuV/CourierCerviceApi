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

        private CookieContainer _cookies = new CookieContainer();

        /// <summary>
        /// Выполняет вход в систему.
        /// </summary>
        /// <param name="login">Имя пользователя.</param>
        /// <param name="password">Пароль.</param>
        public dynamic Login(string login, string password)
        {
            return GetWebResponse("http://localhost:3000/login",
                "{\"login\":\"" + login + "\",\"password\":\"" + password + "\"}",
                "POST"
            );
            //var request = (HttpWebRequest)WebRequest.Create("http://localhost:3000/login");
            //request.Method = "POST";
            //request.Accept = "application/json";
            //request.ContentType = "application/json";
            //request.CookieContainer = _cookies;

            //var body = "{\"login\":\"" + login + "\",\"password\":\"" + password + "\"}";

            //using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            //{
            //    streamWriter.Write(body);
            //}

            //try
            //{
            //    var responseString = string.Empty;
            //    var httpWebResponse = (HttpWebResponse)request.GetResponse();
            //    using (var responseStream = httpWebResponse.GetResponseStream())
            //    {
            //        var reader = new StreamReader(responseStream, Encoding.UTF8);
            //        responseString = reader.ReadToEnd();
            //    }
            //    return responseString;
            //}
            //catch (WebException ex)
            //{
            //    throw new InvalidOperationException("Не удалось выполнить запрос. " + ex.Message, ex);
            //}
        }

        public dynamic GetGraphqlData(string query) 
        {
            var graphqlQuery = "{" + $@"""query"":""{query}""" + "}";
            return GetWebResponse("http://localhost:3000/auth/graphql", query, "POST");
        }


        /// <summary>
        /// Выполняет веб запрос.
        /// </summary>
        /// <param name="uri">URI.</param>
        /// <param name="body">Тело запроса.</param>
        /// <param name="method">Метод запроса.</param>
        /// <returns>Newtonsoft json объект ответа на запрос.</returns>
        public dynamic GetWebResponse(string uri, string body = null, string method = "GET")
        {
            var requestUri = uri;
            var request = (HttpWebRequest)WebRequest.Create(requestUri);
            request.Method = method;
            request.Accept = "application/json";
            request.ContentType = "application/json";
            request.CookieContainer = _cookies;

            if (!string.IsNullOrEmpty(body))
            {
                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(body);
                }
            }

            try
            {
                var responseString = string.Empty;
                var httpWebResponse = (HttpWebResponse)request.GetResponse();
                using (var responseStream = httpWebResponse.GetResponseStream())
                {
                    var reader = new StreamReader(responseStream, Encoding.UTF8);
                    responseString = reader.ReadToEnd();
                }

                return JObject.Parse(responseString);
            }
            catch (WebException ex)
            {
                throw new InvalidOperationException("Не удалось выполнить запрос. " + ex.Message, ex);
            }
        }
    }
}
