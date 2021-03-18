using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using UserManagementSystem.Localization;

namespace UserManagementSystem.Web.Models
{
	public class LogInViewModel
	{
		[DataType(DataType.Password)]
		[Display(Name="Lbl_Password", ResourceType=typeof(StaticContent))]
		[Required]
		public string Password
		{
			get;
			set;
		}

		[Display(Name="Lbl_RememberMe", ResourceType=typeof(StaticContent))]
		public bool RememberMe
		{
			get;
			set;
		}

		[Display(Name="Lbl_Username", ResourceType=typeof(StaticContent))]
		[Required]
		public string UserName
		{
			get;
			set;
		}

		public LogInViewModel()
		{
		}
	}
}