using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary.model
{
    public class Package
    {
        public Guid Id { get; set; }
        public float Weight { get; set; }
        public string Description { get; set; }
        public Guid OrderdId { get; set; }
        public Order Order { get; set; }
    }
}
