using MSLivingChoices.Mvc.Uipc.Attributes;
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
	public class CreateUserViewModel
	{
		[Required]
		public IList<AddressViewModel> Addresses
		{
			get;
			set;
		}

		[Display(Name="Lbl_CommunicationSettings", ResourceType=typeof(StaticContent))]
		public CommunicationSettingsViewModel CommunicationSettings
		{
			get;
			set;
		}

		[Required]
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

		[Required]
		public List<PhoneViewModel> Phones
		{
			get;
			set;
		}

		[Display(Name="Lbl_PrimaryEmail", ResourceType=typeof(StaticContent))]
		[MSLivingChoices.Mvc.Uipc.Attributes.Email]
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
		public UmsRoles SelectedRoleName
		{
			get;
			set;
		}

		public CreateUserViewModel()
		{
		}

		public Account ToBusinessEntity()
		{
			Account account = new Account()
			{
				PrimaryEmail = this.PrimaryEmail,
				FirstName = this.FirstName,
				LastName = this.LastName
			};
			account.FullAddresses.Add(this.Addresses.First<AddressViewModel>().ToBuisnessEntity());
			account.Phones = (
				from p in this.Phones
				where !string.IsNullOrEmpty(p.Number)
				select p.ToBusinessEntity()).ToList<Phone>();
			account.Emails = (
				from p in this.Emails
				where !string.IsNullOrEmpty(p.Value)
				select p into e
				select e.ToBusinessEntity()).ToList<Email>();
			account.CommunicationSettings = new CommunicationSettings(this.CommunicationSettings.Leads, this.CommunicationSettings.Notifications);
			account.Role = SelectedRoleName;
			account.IsActive = this.IsActive;
			account.Publications = this.Publications.SelectMany<PublicationViewModel, SelectListItem>((PublicationViewModel p) => p.Publications).Where<SelectListItem>((SelectListItem p) => p.Selected).Select<SelectListItem, Publication>((SelectListItem p) => new Publication()
			{
				Id = Convert.ToInt32(p.Value),
				Name = p.Text
			}).ToList<Publication>();
			return account;
		}

		public override string ToString()
		{
			return string.Format("First Name: '{0}'; Last Name: '{1}'", this.FirstName, this.LastName);
		}
	}
}