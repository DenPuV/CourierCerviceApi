using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary
{
    public class OrderType
    {
        [JsonProperty("number")]
        public int Number { get; set; }

        [JsonProperty("date")]
        public DateTime Date { get; set; }

        [JsonProperty("packages")]
        public List<PackageType> Packages { get; set; }

        [JsonProperty("contact")]
        public ContactType Contact { get; set; }

        [JsonProperty("route")]
        public RouteType Route { get; set; }
    }
}
