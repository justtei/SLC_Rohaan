using System;
using System.Runtime.CompilerServices;

namespace UserManagementSystem.Web.Models
{
	public class UserListViewModel
	{
		public string Email
		{
			get;
			set;
		}

		public Guid Id
		{
			get;
			set;
		}

		public bool Leads
		{
			get;
			set;
		}

		public bool Notifications
		{
			get;
			set;
		}

		public string Username
		{
			get;
			set;
		}

		public UserListViewModel()
		{
		}
	}
}