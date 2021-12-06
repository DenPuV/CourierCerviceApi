using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary
{
    public class ContactType
    {
        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("secondName")]
        public string SecondName { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }
    }
}
