using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiProviderLibrary
{
    public class GraphQLquery
    {
        public GraphQLquery(string text)
        {
            query = text;
        }

        public string query { get; set; }
    }
}
