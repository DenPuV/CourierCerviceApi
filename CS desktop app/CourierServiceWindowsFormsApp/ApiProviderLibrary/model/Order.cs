using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary.model
{
    public class Order
    {
        public Guid id { get; set; }
        public int Number { get; set; }
        public string Date { get; set; }
        public Guid ContactId { get; set; }
        public Guid StatusId { get; set; }
        public Contact Contact { get; set; }
        public Status Status { get; set; }
        public Route Route { get; set; }
        public List<Package> Packages { get; set; }

    }
}
