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
using Newtonsoft.Json.Linq;

namespace CourierServiceWindowsFormsApp
{
    public partial class LoginForm : Form
    {
        private ApiProvider _provider;

        public LoginForm()
        {
            _provider = new ApiProvider();
            InitializeComponent();
        }

        private void EnterButton_Click(object sender, EventArgs e)
        {
            try
            {
                var response = _provider.Login(LoginTextBox.Text, PasswordTextBox.Text);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
                AnswerLabel.Text = "Ошибка входа!";
            }
        }
    }
}
