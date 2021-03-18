using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Localization;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Models
{
	public class PhoneViewModel
	{
		public Guid CreateUserId
		{
			get;
			set;
		}

		public int Id
		{
			get;
			set;
		}

		[AllowHtml]
		[Display(Name="Lbl_Phone", ResourceType=typeof(StaticContent))]
		public string Number
		{
			get;
			set;
		}

		public List<SelectListItem> PhoneTypes
		{
			get;
			set;
		}

		[Display(Name="Lbl_PhoneType", ResourceType=typeof(StaticContent))]
		[Required]
		public int SelectedPhoneTypeId
		{
			get;
			set;
		}

		public PhoneViewModel() : this(-1, string.Empty)
		{
		}

		public PhoneViewModel(PhoneType phoneType, string number) : this(phoneType.Id, number)
		{
		}

		public PhoneViewModel(int phoneTypeId, string number) : this(-1, phoneTypeId, number, new List<SelectListItem>(), Guid.Empty)
		{
		}

		public PhoneViewModel(int id, int phoneTypeId, string number, List<SelectListItem> phoneTypes, Guid createUserId)
		{
			this.Id = id;
			this.SelectedPhoneTypeId = phoneTypeId;
			this.Number = number;
			this.PhoneTypes = phoneTypes;
			this.CreateUserId = createUserId;
		}

		public Phone ToBusinessEntity()
		{
			Phone phone = new Phone(this.Id, new PhoneType(this.SelectedPhoneTypeId), this.Number, this.CreateUserId);
			return phone;
		}
	}
}