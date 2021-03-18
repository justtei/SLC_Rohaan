using MSLivingChoices.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SLC_Rohaan.Rohaanic
{
    public class SqlOperations
    {
        private SqlConnection scon;
        private SqlCommand scmd;
        public SqlOperations(String query = null)
        {
            scon = new SqlConnection(ConfigurationManager.Instance.MlcSlcConnectionString);
            if(query != null)
            {
                scmd = new SqlCommand(query,scon);
            }
        }
        public SqlCommand GetScmd(String a)
        {
            return scmd = new SqlCommand(a,scon);
            
        }
        
        bool IsOpen = false;
        public SqlOperations ManageScon()
        {
            if (IsOpen)
            {
                scon.Close();
            }
            else
            {
                scon.Open();
            }
            IsOpen = !IsOpen;
            return this;
        }
    }
}