using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary.model
{
    public class Route
    {
        public Guid Id { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
    }
}
