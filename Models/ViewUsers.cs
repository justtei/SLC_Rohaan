using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SLC_Rohaan.Models
{
    public class ViewUsers
    {
		public int idx { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public String Country { get; set; }
		public String State { get; set; }
		public String city { get; set; }
		public string Password { get; set; }
		public String Roles { get; set; }

		public bool IsActivated { get; set; }
	}
}