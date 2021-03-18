using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels;
using SLC_Rohaan.Helpers;
using SLC_Rohaan.Models;
using SLC_Rohaan.Rohaanic;

namespace SLC_Rohaan.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        [HttpGet]
        public ActionResult LogIn()
        {
            return base.View();
        }
        [HttpPost]
        public ActionResult LogIn(LogInVm login)
        {
            if (login.Username != null && login.Username != "" && login.Password != "" && login.Password != null)
            {
                SqlOperations Sqlo = new SqlOperations().ManageScon();
                SqlCommand scmd = Sqlo.GetScmd("select idx from Rohaan_Creds where Email = @Email and Password = @Pass and IsActive = 1");
                scmd.Parameters.AddWithValue("@Email", login.Username);
                scmd.Parameters.AddWithValue("@Pass", login.Password);
                Session["UserId"] = (int?)scmd.ExecuteScalar();
                
                Sqlo.ManageScon();
                if (Session["UserId"] == null)
                {
                    ViewBag.Msg = "Incorrect Login Or Password";
                    return base.RedirectToAction("Login");
                }
                else
                {
                    return RedirectToAction("Dashboard");
                }
            }
            else
            {
                ViewBag.Msg = "Incorrect Login Or Password";
                return base.RedirectToAction("Login");
            }
        }
        public ActionResult Dashboard()
        {
            if (Session["UserId"] != null) {
                if (GetRoles.IsAdmin((int)Session["UserId"]))
                {
                    return RedirectToAction("ViewUsers");
                }
                else if (GetRoles.IsIList((int) Session["UserId"])) {
                    return RedirectToAction("Edit", "Community", new { id = Session["UserId"] });
                }
                else
                {
                    return RedirectToAction("Edit", "Community", new { id = Session["UserId"] });
                }
            }
            else
            {
                return RedirectToAction("LogIn");
            }
        }
        [Authenticate]
        [CAuthorize("Admin")]
        [HttpGet]
        public ActionResult Signup()
        {
            return base.View();
        }
        [HttpPost]
        [CAuthorize("Admin")]
        public ActionResult Signup(Signup signup)
        {
            if(signup.FirstName == null || String.IsNullOrEmpty(signup.FirstName) || signup.Email == null || String.IsNullOrEmpty(signup.Email)||signup.LastName == null || String.IsNullOrEmpty(signup.LastName) || signup.LastName == null || String.IsNullOrEmpty(signup.LastName) || signup.Password == null || String.IsNullOrEmpty(signup.Password))
            {
                return RedirectToAction("Signup");
            }
            SqlOperations sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd1 = sqlo.GetScmd("select idx from Rohaan_Creds where Email = @Email");
            scmd1.Parameters.AddWithValue("@Email", signup.Email);
            bool Scal = String.IsNullOrEmpty((String)scmd1.ExecuteScalar());
            sqlo.ManageScon();
            if (!Scal)
            {
                ViewBag.Msg = "User Already Exist With Same Email";
                return RedirectToAction("Signup");
            }
            signup.AddedBy =(int) Session["UserId"];
            signup.AddedOn = DateTime.Now;
            SqlCommand scmd = sqlo.GetScmd("Insert into Rohaan_Creds (FirstName,LastName,Email,IsAdmin,IsPublisher,IsAuthor,IsIList,IsActive,Password,AddedOn,AddedBy) Values" +
                "(@FN,@LN,@EM,@IsAdmin,@IP,@IsAuth,@IsIL,@IsAct,@Pass,@AddedOn,@AddedBy)");
            scmd.Parameters.AddWithValue("@FN", signup.FirstName);
            scmd.Parameters.AddWithValue("@LN",signup.LastName);
            scmd.Parameters.AddWithValue("@EM",signup.Email);
            scmd.Parameters.AddWithValue("@IsAdmin",signup.IsAdmin);
            scmd.Parameters.AddWithValue("@IP", signup.IsPublisher);
            scmd.Parameters.AddWithValue("@IsAuth", signup.IsAuthor);
            scmd.Parameters.AddWithValue("@IsIL", signup.IsIlist);
            scmd.Parameters.AddWithValue("@IsAct", signup.IsActive);
            scmd.Parameters.AddWithValue("@Pass",signup.Password);
            scmd.Parameters.AddWithValue("@AddedOn",signup.AddedOn);
            scmd.Parameters.AddWithValue("@AddedBy",signup.AddedBy);
            int rowa = 0;
            try
            {
                rowa = scmd.ExecuteNonQuery();
            }
            catch{}
            finally { sqlo.ManageScon(); }
            if(rowa == 0)
            {
                return RedirectToAction("Signup");
            }
            else
            {
                return RedirectToAction("ViewUsers");
            }
        }
        [SLC_Rohaan.Helpers.Authenticate]
        [CAuthorize("Admin")]
        public ActionResult ViewUsers()
        {
            SqlOperations sqlo = new SqlOperations().ManageScon();
            SqlCommand scmd =  sqlo.GetScmd("SELECT rc.idx, rc.FirstName, rc.LastName, rc.Email, rc.IsAdmin, rc.IsPublisher, rc.IsAuthor, rc.IsIList, rc.IsActive, rc.Password FROM Rohaan_Creds as rc");
            List<ViewUsers> vuList = new List<ViewUsers>();
            SqlDataReader dr = scmd.ExecuteReader();
            while (dr.Read()) {
                ViewUsers vu = new ViewUsers();
                vu.LastName = dr.GetString(dr.GetOrdinal("LastName"));
                vu.FirstName = dr.GetString(dr.GetOrdinal("FirstName"));
                vu.Email = dr.GetString(dr.GetOrdinal("Email"));
                vu.Password = dr.GetString(dr.GetOrdinal("Password"));
                vu.idx = dr.GetInt32(dr.GetOrdinal("idx"));
                vu.Roles = (dr.GetBoolean(dr.GetOrdinal("IsAdmin")) == true ? "Admin ," : "") + (dr.GetBoolean(dr.GetOrdinal("IsPublisher")) == true ? "Publisher ," : "") + (dr.GetBoolean(dr.GetOrdinal("IsAuthor")) == true ? "Author ," : "") + (dr.GetBoolean(dr.GetOrdinal("IsIList")) == true ? "IList ," : "");
                vu.Roles = vu.Roles.Remove(vu.Roles.Length-2,1);
                vu.IsActivated = dr.GetBoolean(dr.GetOrdinal("IsAdmin"));
                vuList.Add(vu);
            }
            sqlo.ManageScon();
            return View(vuList);
        }
    }
}