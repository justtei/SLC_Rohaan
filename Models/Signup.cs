using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SLC_Rohaan.Models
{
	public class Signup
	{
		public int idx { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public int city { get; set; }
		public bool IsAdmin { get; set; }
		public bool IsPublisher { get; set; }
		public bool IsAuthor { get; set; }
		public bool IsIlist { get; set; }
		public bool IsActive { get; set; }
		public string Password { get; set; }
		public DateTime AddedOn { get; set; }
		public int AddedBy { get; set; }
		public int ModifiedBy { get; set; }
		public DateTime ModifiedOn {get;set;}
    }
}