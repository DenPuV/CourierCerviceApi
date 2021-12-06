
namespace CourierServiceWindowsFormsApp
{
    partial class AdminApp
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AdminApp));
            this.NotifyIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.OrdersTab = new System.Windows.Forms.TabPage();
            this.OrdersGridView = new System.Windows.Forms.DataGridView();
            this.PackagesTab = new System.Windows.Forms.TabPage();
            this.OrderButton = new System.Windows.Forms.Button();
            this.OrderGroupBox = new System.Windows.Forms.GroupBox();
            this.label1 = new System.Windows.Forms.Label();
            this.OrderNumberLabel = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.OrderDateLabel = new System.Windows.Forms.Label();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.FNameLabel = new System.Windows.Forms.Label();
            this.SNameLabel = new System.Windows.Forms.Label();
            this.PhoneLabel = new System.Windows.Forms.Label();
            this.tabControl1.SuspendLayout();
            this.OrdersTab.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.OrdersGridView)).BeginInit();
            this.OrderGroupBox.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // NotifyIcon
            // 
            this.NotifyIcon.Icon = ((System.Drawing.Icon)(resources.GetObject("NotifyIcon.Icon")));
            this.NotifyIcon.Text = "CourierService";
            this.NotifyIcon.Visible = true;
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.OrdersTab);
            this.tabControl1.Controls.Add(this.PackagesTab);
            this.tabControl1.Location = new System.Drawing.Point(95, 12);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(820, 380);
            this.tabControl1.TabIndex = 0;
            // 
            // OrdersTab
            // 
            this.OrdersTab.Controls.Add(this.groupBox1);
            this.OrdersTab.Controls.Add(this.OrderGroupBox);
            this.OrdersTab.Controls.Add(this.OrdersGridView);
            this.OrdersTab.Location = new System.Drawing.Point(4, 22);
            this.OrdersTab.Name = "OrdersTab";
            this.OrdersTab.Padding = new System.Windows.Forms.Padding(3);
            this.OrdersTab.Size = new System.Drawing.Size(812, 354);
            this.OrdersTab.TabIndex = 0;
            this.OrdersTab.Text = "Заказы";
            this.OrdersTab.UseVisualStyleBackColor = true;
            // 
            // OrdersGridView
            // 
            this.OrdersGridView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.OrdersGridView.Location = new System.Drawing.Point(6, 6);
            this.OrdersGridView.Name = "OrdersGridView";
            this.OrdersGridView.Size = new System.Drawing.Size(258, 342);
            this.OrdersGridView.TabIndex = 0;
            this.OrdersGridView.CellDoubleClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.OrdersGridView_CellDoubleClick);
            // 
            // PackagesTab
            // 
            this.PackagesTab.Location = new System.Drawing.Point(4, 22);
            this.PackagesTab.Name = "PackagesTab";
            this.PackagesTab.Padding = new System.Windows.Forms.Padding(3);
            this.PackagesTab.Size = new System.Drawing.Size(812, 354);
            this.PackagesTab.TabIndex = 1;
            this.PackagesTab.Text = "Посылки";
            this.PackagesTab.UseVisualStyleBackColor = true;
            // 
            // OrderButton
            // 
            this.OrderButton.Location = new System.Drawing.Point(12, 62);
            this.OrderButton.Name = "OrderButton";
            this.OrderButton.Size = new System.Drawing.Size(75, 23);
            this.OrderButton.TabIndex = 1;
            this.OrderButton.Text = "Заказы";
            this.OrderButton.UseVisualStyleBackColor = true;
            this.OrderButton.Click += new System.EventHandler(this.OrderButton_Click);
            // 
            // OrderGroupBox
            // 
            this.OrderGroupBox.Controls.Add(this.OrderDateLabel);
            this.OrderGroupBox.Controls.Add(this.label2);
            this.OrderGroupBox.Controls.Add(this.OrderNumberLabel);
            this.OrderGroupBox.Controls.Add(this.label1);
            this.OrderGroupBox.Location = new System.Drawing.Point(270, 6);
            this.OrderGroupBox.Name = "OrderGroupBox";
            this.OrderGroupBox.Size = new System.Drawing.Size(200, 132);
            this.OrderGroupBox.TabIndex = 1;
            this.OrderGroupBox.TabStop = false;
            this.OrderGroupBox.Text = "Заказ";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(7, 22);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(41, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Номер";
            // 
            // OrderNumberLabel
            // 
            this.OrderNumberLabel.AutoSize = true;
            this.OrderNumberLabel.Location = new System.Drawing.Point(10, 39);
            this.OrderNumberLabel.Name = "OrderNumberLabel";
            this.OrderNumberLabel.Size = new System.Drawing.Size(0, 13);
            this.OrderNumberLabel.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(10, 68);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(33, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Дата";
            // 
            // OrderDateLabel
            // 
            this.OrderDateLabel.AutoSize = true;
            this.OrderDateLabel.Location = new System.Drawing.Point(10, 96);
            this.OrderDateLabel.Name = "OrderDateLabel";
            this.OrderDateLabel.Size = new System.Drawing.Size(0, 13);
            this.OrderDateLabel.TabIndex = 3;
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.PhoneLabel);
            this.groupBox1.Controls.Add(this.SNameLabel);
            this.groupBox1.Controls.Add(this.FNameLabel);
            this.groupBox1.Controls.Add(this.label5);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Location = new System.Drawing.Point(479, 6);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(330, 132);
            this.groupBox1.TabIndex = 2;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Контакт";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(7, 22);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(29, 13);
            this.label3.TabIndex = 0;
            this.label3.Text = "Имя";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(194, 20);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(56, 13);
            this.label4.TabIndex = 1;
            this.label4.Text = "Фамилия";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(10, 82);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(52, 13);
            this.label5.TabIndex = 2;
            this.label5.Text = "Телефон";
            // 
            // FNameLabel
            // 
            this.FNameLabel.AutoSize = true;
            this.FNameLabel.Location = new System.Drawing.Point(7, 39);
            this.FNameLabel.Name = "FNameLabel";
            this.FNameLabel.Size = new System.Drawing.Size(0, 13);
            this.FNameLabel.TabIndex = 3;
            // 
            // SNameLabel
            // 
            this.SNameLabel.AutoSize = true;
            this.SNameLabel.Location = new System.Drawing.Point(197, 39);
            this.SNameLabel.Name = "SNameLabel";
            this.SNameLabel.Size = new System.Drawing.Size(0, 13);
            this.SNameLabel.TabIndex = 4;
            // 
            // PhoneLabel
            // 
            this.PhoneLabel.AutoSize = true;
            this.PhoneLabel.Location = new System.Drawing.Point(13, 99);
            this.PhoneLabel.Name = "PhoneLabel";
            this.PhoneLabel.Size = new System.Drawing.Size(0, 13);
            this.PhoneLabel.TabIndex = 5;
            // 
            // AdminApp
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(927, 404);
            this.Controls.Add(this.OrderButton);
            this.Controls.Add(this.tabControl1);
            this.Name = "AdminApp";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Панель администратора";
            this.tabControl1.ResumeLayout(false);
            this.OrdersTab.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.OrdersGridView)).EndInit();
            this.OrderGroupBox.ResumeLayout(false);
            this.OrderGroupBox.PerformLayout();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.NotifyIcon NotifyIcon;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage OrdersTab;
        private System.Windows.Forms.DataGridView OrdersGridView;
        private System.Windows.Forms.TabPage PackagesTab;
        private System.Windows.Forms.Button OrderButton;
        private System.Windows.Forms.GroupBox OrderGroupBox;
        private System.Windows.Forms.Label OrderDateLabel;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label OrderNumberLabel;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label PhoneLabel;
        private System.Windows.Forms.Label SNameLabel;
        private System.Windows.Forms.Label FNameLabel;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
    }
}