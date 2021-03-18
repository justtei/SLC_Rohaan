using System;
using System.Collections.Generic;
using MSLivingChoices.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using SLC_Rohaan.Rohaanic;

namespace SLC_Rohaan.Helpers
{
    public class CAuthorizeAttribute : AuthorizeAttribute
    {
        public CAuthorizeAttribute(params string[] roles)
        {
            List<string> loweredRoles = new List<string>();
            int i = 0;
            foreach (String st in roles)
            {
                loweredRoles.Add(st.ToLower());
                i++;
            }
            this.allowedroles = loweredRoles.ToArray();
        }
        private readonly string[] allowedroles;
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            bool authorize = false;
            var userId = Convert.ToString(httpContext.Session["UserId"]);
            if (!string.IsNullOrEmpty(userId)) {
                
                if(GetRoles.IsAdmin(int.Parse(userId)))
                {
                    return true;
                }
                else if(allowedroles[0].ToLower() == "publisher" && GetRoles.IsPublisher(int.Parse(userId)))
                {
                    return true;
                }
                else if (allowedroles[0].ToLower() == "author" && GetRoles.IsAuthor(int.Parse(userId)))
                {
                    return true;
                }
                else if (allowedroles[0].ToLower() == "ilist" && GetRoles.IsIList(int.Parse(userId)))
                {
                    return true;
                }
            }

            return authorize;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(
               new RouteValueDictionary
               {
                    { "controller", "Account" },
                    { "action", "LogIn" }
               });
        }
    }
}