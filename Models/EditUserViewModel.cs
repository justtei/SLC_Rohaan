using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Localization;
using UserManagementSystem.Shared.Entities;
using UserManagementSystem.Shared.Entities.Enum;
using UserManagementSystem.Web.Attributes;

namespace UserManagementSystem.Web.Models
{
	public class EditUserViewModel
	{
		[Display(Name="Lbl_Emails", ResourceType=typeof(StaticContent))]
		public List<EmailViewModel> Emails
		{
			get;
			set;
		}

		[AllowHtml]
		[Display(Name="Lbl_FirstName", ResourceType=typeof(StaticContent))]
		[Required]
		public string FirstName
		{
			get;
			set;
		}

		public AddressViewModel FullAddress
		{
			get;
			set;
		}

		public bool HasLeads
		{
			get;
			set;
		}

		public bool HasNotifications
		{
			get;
			set;
		}

		[Required]
		public Guid Id
		{
			get;
			set;
		}

		[Display(Name="Lbl_AccountStatus", ResourceType=typeof(StaticContent))]
		public bool IsActive
		{
			get;
			set;
		}

		[AllowHtml]
		[Display(Name="Lbl_LastName", ResourceType=typeof(StaticContent))]
		[Required]
		public string LastName
		{
			get;
			set;
		}

		[Display(Name="Lbl_Phones", ResourceType=typeof(StaticContent))]
		public List<PhoneViewModel> Phones
		{
			get;
			set;
		}

		[Display(Name="Lbl_PrimaryEmail", ResourceType=typeof(StaticContent))]
		[Email]
		[Required]
		public string PrimaryEmail
		{
			get;
			set;
		}

		[Publications]
		public List<PublicationViewModel> Publications
		{
			get;
			set;
		}

		public List<SelectListItem> Roles
		{
			get;
			set;
		}

		[Display(Name="Lbl_Role", ResourceType=typeof(StaticContent))]
		[Required]
		public UmsRoles SelectedRole
		{
			get;
			set;
		}

		public EditUserViewModel() : this(new Account(), new List<SelectListItem>(), new List<SelectListItem>(), new List<SelectListItem>(), new List<SelectListItem>(), new List<PhoneViewModel>(), new List<EmailViewModel>(), new List<PublicationViewModel>())
		{
		}

		public EditUserViewModel(Account account, IEnumerable<SelectListItem> countries, IEnumerable<SelectListItem> states, IEnumerable<SelectListItem> cities, List<SelectListItem> roles, List<PhoneViewModel> phones, List<EmailViewModel> emails, List<PublicationViewModel> publications)
		{
			this.Id = account.Id;
			this.PrimaryEmail = account.PrimaryEmail;
			this.FirstName = account.FirstName;
			this.LastName = account.LastName;
			this.Phones = phones;
			this.Emails = emails;
			this.Publications = publications;
			this.Roles = roles;
			this.SelectedRole = account.Role;
			this.HasLeads = account.CommunicationSettings.HasLeads;
			this.HasNotifications = account.CommunicationSettings.HasNotifications;
			this.IsActive = account.IsActive;
			UserManagementSystem.Shared.Entities.FullAddress fullAddress = account.FullAddresses.FirstOrDefault<UserManagementSystem.Shared.Entities.FullAddress>();
			if (fullAddress != null)
			{
				this.FullAddress = new AddressViewModel(fullAddress.Id, fullAddress.AddressLine1, cities, fullAddress.City.Id, states, fullAddress.State.Id, countries, fullAddress.Country.Id, fullAddress.Zip, fullAddress.CreateUserId);
			}
		}

		public Account ToBusinessEntity()
		{
			List<UserManagementSystem.Shared.Entities.FullAddress> fullAddresses = new List<UserManagementSystem.Shared.Entities.FullAddress>()
			{
				this.FullAddress.ToBuisnessEntity()
			};
			List<Phone> list = (
				from p in this.Phones
				where !string.IsNullOrEmpty(p.Number)
				select p into phone
				select phone.ToBusinessEntity()).ToList<Phone>();
			List<Email> emails = (
				from p in this.Emails
				where !string.IsNullOrEmpty(p.Value)
				select p into email
				select email.ToBusinessEntity()).ToList<Email>();
			List<Publication> publications = new List<Publication>();
			foreach (PublicationViewModel publication in this.Publications)
			{
				if (publication.BrandSelected)
				{
					foreach (SelectListItem selectListItem in publication.Publications)
					{
						if (selectListItem.Selected)
						{
							BrandType brand = publication.Brand;
							publications.Add(new Publication(Convert.ToInt32(selectListItem.Value), selectListItem.Text, brand));
						}
					}
				}
			}
			CommunicationSettings communicationSetting = new CommunicationSettings(this.HasLeads, this.HasNotifications);
			Account account = new Account(this.Id, this.FirstName, this.LastName, fullAddresses, list, this.PrimaryEmail, emails, publications, this.SelectedRole, communicationSetting, this.IsActive);
			return account;
		}
	}
}