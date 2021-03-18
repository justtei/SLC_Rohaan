using System;
using System.Runtime.CompilerServices;
using UserManagementSystem.Shared.Entities.Enum;

namespace UserManagementSystem.Web.Models
{
	public class UserGridOptionsViewModel
	{
		public SortOrder EmailOrder
		{
			get;
			set;
		}

		public CheckFilter LeadFilter
		{
			get;
			set;
		}

		public SortOrder NameOrder
		{
			get;
			set;
		}

		public CheckFilter NotificationFilter
		{
			get;
			set;
		}

		public string SubEmailFilter
		{
			get;
			set;
		}

		public string SubnameFilter
		{
			get;
			set;
		}

		public UserGridOptionsViewModel(string subnameFilter, string subEmailFilter, SortOrder nameOrder, SortOrder emailOrder, CheckFilter leadFilter, CheckFilter notificationFilter)
		{
			this.SubnameFilter = subnameFilter ?? string.Empty;
			this.SubEmailFilter = subEmailFilter ?? string.Empty;
			this.NameOrder = nameOrder;
			this.EmailOrder = emailOrder;
			this.LeadFilter = leadFilter;
			this.NotificationFilter = notificationFilter;
		}
	}
}