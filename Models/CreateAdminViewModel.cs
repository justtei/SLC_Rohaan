using MSLivingChoices.Mvc.Uipc.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Localization;
using UserManagementSystem.Shared.Entities;
using UserManagementSystem.Shared.Entities.Enum;

namespace UserManagementSystem.Web.Models
{
	public class CreateAdminViewModel
	{
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

		[Display(Name="Lbl_PrimaryEmail", ResourceType=typeof(StaticContent))]
		[Email]
		[Required]
		public string PrimaryEmail
		{
			get;
			set;
		}

		public CreateAdminViewModel()
		{
		}

		public Account ToBuissnessEntity()
		{
			List<FullAddress> fullAddresses = new List<FullAddress>();
			List<Phone> phones = new List<Phone>();
			List<Email> emails = new List<Email>();
			List<Publication> publications = new List<Publication>();
			CommunicationSettings communicationSetting = new CommunicationSettings();
			Account account = new Account(Guid.Empty, this.FirstName, this.LastName, fullAddresses, phones, this.PrimaryEmail, emails, publications, UmsRoles.Admin, communicationSetting, this.IsActive);
			return account;
		}
	}
}