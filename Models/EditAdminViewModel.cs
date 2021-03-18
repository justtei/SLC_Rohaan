using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Localization;
using UserManagementSystem.Shared.Entities;
using UserManagementSystem.Shared.Entities.Enum;
using UserManagementSystem.Web.Attributes;

namespace UserManagementSystem.Web.Models
{
	public class EditAdminViewModel
	{
		[AllowHtml]
		[Display(Name="Lbl_FirstName", ResourceType=typeof(StaticContent))]
		[Required]
		public string FirstName
		{
			get;
			set;
		}

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

		[Display(Name="Lbl_PrimaryEmail", ResourceType=typeof(StaticContent))]
		[Email]
		[Required]
		public string PrimaryEmail
		{
			get;
			set;
		}

		public EditAdminViewModel() : this(Guid.Empty, string.Empty, string.Empty, string.Empty, false)
		{
		}

		public EditAdminViewModel(Guid id, string primaryEmail, string firstName, string lastName, bool isActive)
		{
			this.Id = id;
			this.PrimaryEmail = primaryEmail;
			this.FirstName = firstName;
			this.LastName = lastName;
			this.IsActive = isActive;
		}

		public Account ToBuissnessEntity()
		{
			List<FullAddress> fullAddresses = new List<FullAddress>();
			List<Phone> phones = new List<Phone>();
			List<Email> emails = new List<Email>();
			List<Publication> publications = new List<Publication>();
			CommunicationSettings communicationSetting = new CommunicationSettings();
			Account account = new Account(this.Id, this.FirstName, this.LastName, fullAddresses, phones, this.PrimaryEmail, emails, publications, UmsRoles.Admin, communicationSetting, this.IsActive);
			return account;
		}
	}
}