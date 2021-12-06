using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourierServiceWindowsFormsApp.Models
{
    public class Order
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("number")]
        public int Number { get; set; }

        [JsonProperty("date")]
        public DateTime Date { get; set; }

        [JsonProperty("contactId")]
        public Guid ContactId { get; set; }
    }
}
