using MSLivingChoices.Mvc.Uipc.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Localization;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Models
{
	public class EmailViewModel
	{
		public Guid CreateUserId
		{
			get;
			set;
		}

		public List<SelectListItem> EmailTypes
		{
			get;
			set;
		}

		public int Id
		{
			get;
			set;
		}

		[Display(Name="Lbl_EmailType", ResourceType=typeof(StaticContent))]
		[Required]
		public int SelectedEmailTypeId
		{
			get;
			set;
		}

		[Display(Name="Lbl_Email", ResourceType=typeof(StaticContent))]
		[Email]
		public string Value
		{
			get;
			set;
		}

		public EmailViewModel() : this(-1, string.Empty)
		{
		}

		public EmailViewModel(int emailTypeId, string value) : this(-1, emailTypeId, value, new List<SelectListItem>(), Guid.Empty)
		{
		}

		public EmailViewModel(EmailType emailType, string value) : this(-1, emailType.Id, value, new List<SelectListItem>(), Guid.Empty)
		{
		}

		public EmailViewModel(int id, int selectedEmailTypeId, string value, List<SelectListItem> emailTypes, Guid createUserId)
		{
			this.Id = id;
			this.SelectedEmailTypeId = selectedEmailTypeId;
			this.Value = value;
			this.EmailTypes = emailTypes;
			this.CreateUserId = createUserId;
		}

		public Email ToBusinessEntity()
		{
			Email email = new Email(this.Id, new EmailType(this.SelectedEmailTypeId), this.Value, this.CreateUserId);
			return email;
		}
	}
}