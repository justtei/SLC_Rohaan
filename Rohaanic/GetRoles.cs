using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using UserManagementSystem.Shared.Entities;

namespace SLC_Rohaan.Rohaanic
{
    public class GetRoles
    {

        public static bool IsIList(int UserId)
        {
            SqlOperations sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd = sqlo.GetScmd("Select * from Rohaan_Creds where IsActive = 1 and idx = " + UserId);
            SqlDataReader dr = scmd.ExecuteReader();

            bool IsIList = false;

            while (dr.Read())
            {
                
                IsIList = dr.GetBoolean(dr.GetOrdinal("IsIList"));
            }
            sqlo.ManageScon();
            if (IsIList)
            {
                return true;
            }
            
            return false;
        }
        public static bool IsAdmin(int UserId)
        {
            SqlOperations sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd = sqlo.GetScmd("Select * from Rohaan_Creds where IsActive = 1 and idx = " + UserId);
            SqlDataReader dr = scmd.ExecuteReader();
            bool IsAdmin = false;

            while (dr.Read())
            {
                IsAdmin = dr.GetBoolean(dr.GetOrdinal("IsAdmin"));
            }
            sqlo.ManageScon();
            if (IsAdmin)
            {
                return true;
            }
            return false;
        }
        public static bool IsPublisher(int UserId)
        {
            SqlOperations sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd = sqlo.GetScmd("Select * from Rohaan_Creds where IsActive = 1 and idx = " + UserId);
            SqlDataReader dr = scmd.ExecuteReader();
            bool IsPublisher = false;

            while (dr.Read())
            {
                
                IsPublisher = dr.GetBoolean(dr.GetOrdinal("IsPublisher"));
            }
            sqlo.ManageScon();
            if (IsPublisher)
            {
                return true;
            }
            return false;
        }
        public static bool IsAuthor(int UserId)
        {
            SqlOperations sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd = sqlo.GetScmd("Select * from Rohaan_Creds where IsActive = 1 and idx = " + UserId);
            SqlDataReader dr = scmd.ExecuteReader();
            bool IsAuthor = false;

            while (dr.Read())
            {
                
                IsAuthor = dr.GetBoolean(dr.GetOrdinal("IsAuthor"));
            }
            sqlo.ManageScon();
            if (IsAuthor)
            {
                return true;
            }
            return false;
        }

        public static Account LogOnViewModelCaller()
        {
            int id =(int) HttpContext.Current.Session["UserId"];
            Account acc = new Account();
            SqlOperations Sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd = Sqlo.GetScmd("select FirstName,LastName from Rohaan_Creds where idx = " + id);
            SqlDataReader sdr = scmd.ExecuteReader();
            while(sdr.Read())
            {
                acc.FirstName = sdr["FirstName"].ToString();
                acc.LastName = sdr["LastName"].ToString();
            }
            Sqlo.ManageScon();

            return acc;
        }
    }
}