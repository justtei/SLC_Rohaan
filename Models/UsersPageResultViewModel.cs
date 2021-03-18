using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace UserManagementSystem.Web.Models
{
	public class UsersPageResultViewModel
	{
		public UserGridOptionsViewModel GridOptions
		{
			get;
			set;
		}

		public UserPaginationViewModel Pagination
		{
			get;
			set;
		}

		public List<UserListViewModel> Users
		{
			get;
			set;
		}

		public UsersPageResultViewModel(List<UserListViewModel> users, UserGridOptionsViewModel gridOptions, UserPaginationViewModel pagination)
		{
			this.Users = users;
			this.GridOptions = gridOptions;
			this.Pagination = pagination;
		}
	}
}