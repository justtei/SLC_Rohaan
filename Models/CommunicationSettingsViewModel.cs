using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace UserManagementSystem.Web.Models
{
	public class CommunicationSettingsViewModel
	{
		[DisplayName("Leads")]
		public bool Leads
		{
			get;
			set;
		}

		[DisplayName("Notifications")]
		public bool Notifications
		{
			get;
			set;
		}

		public CommunicationSettingsViewModel()
		{
		}
	}
}