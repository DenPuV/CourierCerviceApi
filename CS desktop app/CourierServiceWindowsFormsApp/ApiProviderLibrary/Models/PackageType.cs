using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary
{
    public class PackageType
    {
        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("weight")]
        public float Weight { get; set; }
    }
}
