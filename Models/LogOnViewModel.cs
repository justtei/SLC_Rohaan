using SLC_Rohaan.Rohaanic;
using System;
using System.Data.SqlClient;
using System.Runtime.CompilerServices;
using UserManagementSystem.Business.Components;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Models
{
	public class LogOnViewModel
	{
		public string Username
		{
			get;
			set;
		}

		public LogOnViewModel()
		{
			var shortenedAccountById = GetRoles.LogOnViewModelCaller();
			this.Username = string.Format("{0} {1}", shortenedAccountById.FirstName, shortenedAccountById.LastName);
		}
	}
}