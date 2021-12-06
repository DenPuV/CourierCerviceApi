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
                var isAdmin = false;
                var response = _provider.LoginAsync(LoginTextBox.Text, PasswordTextBox.Text).Result;
                foreach (var role in response.roles)
                {
                    if (role.code == "admin")
                    {
                        isAdmin = true;
                        break;
                    }
                }
                if (isAdmin)
                {
                    GrantAccess();
                }
                else
                {
                    MessageBox.Show("У этого пользователя нет прав администратора.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void GrantAccess()
        {
            var adminForm = new AdminApp(_provider);
            adminForm.Show();
        }
    }
}
