using System;
using System.Runtime.CompilerServices;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Models
{
	public class CountryViewModel
	{
		public int Id
		{
			get;
			set;
		}

		public string Name
		{
			get;
			set;
		}

		public CountryViewModel(Country country)
		{
			this.Id = country.Id;
			this.Name = country.Name;
		}
	}
}