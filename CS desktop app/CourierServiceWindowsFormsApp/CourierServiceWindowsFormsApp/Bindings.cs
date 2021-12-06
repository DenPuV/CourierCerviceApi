using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CourierServiceWindowsFormsApp.Models;

namespace CourierServiceWindowsFormsApp
{
    public class Bindings
    {
        private List<Order> _orders = new List<Order>();

        public List<Order> Orders 
        {
            get
            {
                return _orders;
            }
            set
            {
                OrdersSource.DataSource = new BindingList<Order>(value);
                _orders = value;
            }
        }

        public Order Order { get; set; }

        public BindingSource OrdersSource { get; private set; } = new BindingSource();
    }
}
