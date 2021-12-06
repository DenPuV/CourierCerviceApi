using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary
{
    public class GraphQLResponse
    {
        [JsonProperty("data")]
        public string Data { get; set; }

        [JsonProperty("errors")]
        public List<GraphQLError> Errors {get;set;}
    }

    public class GraphQLError
    {
        [JsonProperty("message")]
        public string Message { get; set; }
    }
}
