using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Localization;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Models
{
	public class AddressViewModel
	{
		[AllowHtml]
		[Display(Name="Lbl_Address", ResourceType=typeof(StaticContent))]
		[Required]
		public string Address
		{
			get;
			set;
		}

		public int AddressId
		{
			get;
			set;
		}

		public IEnumerable<SelectListItem> Cities
		{
			get;
			set;
		}

		public IEnumerable<SelectListItem> Countries
		{
			get;
			set;
		}

		public Guid CreateUserId
		{
			get;
			set;
		}

		[Display(Name="Lbl_City", ResourceType=typeof(StaticContent))]
		[Required]
		public int SelectedCityID
		{
			get;
			set;
		}

		[Display(Name="Lbl_Country", ResourceType=typeof(StaticContent))]
		[Required]
		public int SelectedCountryID
		{
			get;
			set;
		}

		[Display(Name="Lbl_State", ResourceType=typeof(StaticContent))]
		[Required]
		public int SelectedStateID
		{
			get;
			set;
		}

		public IEnumerable<SelectListItem> States
		{
			get;
			set;
		}

		[AllowHtml]
		[Display(Name="Lbl_Zip", ResourceType=typeof(StaticContent))]
		[Required]
		public string Zip
		{
			get;
			set;
		}

		public AddressViewModel() : this(-1, string.Empty, new List<SelectListItem>(), -1, new List<SelectListItem>(), -1, new List<SelectListItem>(), -1, string.Empty, Guid.Empty)
		{
		}

		public AddressViewModel(int addressId, string address, IEnumerable<SelectListItem> cities, int selectedCityID, IEnumerable<SelectListItem> states, int selectedStateID, IEnumerable<SelectListItem> countries, int selectedCountryID, string zip, Guid createUserId)
		{
			this.AddressId = addressId;
			this.Address = address;
			this.Cities = cities;
			this.SelectedCityID = selectedCityID;
			this.States = states;
			this.SelectedStateID = selectedStateID;
			this.Countries = countries;
			this.SelectedCountryID = selectedCountryID;
			this.Zip = zip;
			this.CreateUserId = createUserId;
		}

		public FullAddress ToBuisnessEntity()
		{
			FullAddress fullAddress = new FullAddress(this.AddressId, this.Address, string.Empty, new City(this.SelectedCityID), new State(this.SelectedStateID), new Country(this.SelectedCountryID), this.Zip, this.CreateUserId);
			return fullAddress;
		}
	}
}