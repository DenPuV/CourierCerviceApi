using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using ApiProviderLibrary;
using CourierServiceWindowsFormsApp.Models;
using Newtonsoft.Json;

namespace CourierServiceWindowsFormsApp
{
    public partial class AdminApp : Form
    {
        private ApiProvider _provider;
        private Bindings _bindings;

        public AdminApp(ApiProvider provider)
        {
            InitializeComponent();
            ShowInTaskbar = false;
            _bindings = new Bindings();
            BindValues();

            _provider = provider;
            SetWebsocket();
        }

        private void BindValues()
        {
            OrdersGridView.DataSource = _bindings.OrdersSource;
        }

        private void SetWebsocket()
        {
            _provider.ConnectWebSocket();
            _provider.Client.OnWebsocketMessage += message => ShowNotify("Сообщение", message.Data);
            var command = @"{""command"": ""LOGIN"", ""data"": {""login"": """ + _provider.Login + @""", ""token"": """ + _provider.Token + @"""}}";
            _provider.Client.SendMessage(command);
        }

        private void ShowNotify(string title, string text)
        {
            NotifyIcon.BalloonTipTitle = title;
            NotifyIcon.BalloonTipText = text;
            NotifyIcon.ShowBalloonTip(10);
        }

        private async void OrderButton_Click(object sender, EventArgs e)
        {
            _bindings.Orders = JsonConvert.DeserializeObject<List<Order>>(await _provider.GetOrders());
            BindValues();
        }

        private void OrdersGridView_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            var order = _bindings.Orders[e.RowIndex];
            OrderNumberLabel.Text = order.Number.ToString();
            OrderDateLabel.Text = order.Date.ToShortDateString();
            dynamic contact = GetContact(order.ContactId).Result[0];
            FNameLabel.Text = contact.firstName;
            SNameLabel.Text = contact.secondName;
            PhoneLabel.Text = contact.phone;
        }

        private Task<dynamic> GetContact(Guid contactId)
        {
            var uri = "/auth/admin/contact/" + contactId.ToString();
            MessageBox.Show(_provider.GetWebResponseAsync(uri).Result);
            return _provider.GetWebResponseDynamicAsync(uri);
        }
    }
}
