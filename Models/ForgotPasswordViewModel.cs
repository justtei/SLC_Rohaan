using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using UserManagementSystem.Localization;
using UserManagementSystem.Web.Attributes;

namespace UserManagementSystem.Web.Models
{
	public class ForgotPasswordViewModel
	{
		[Display(Name="Lbl_Email", ResourceType=typeof(StaticContent))]
		[Email]
		[Required]
		public string Email
		{
			get;
			set;
		}

		public ForgotPasswordViewModel()
		{
		}
	}
}