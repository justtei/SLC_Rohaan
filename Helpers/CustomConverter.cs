using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Shared.Entities;
using UserManagementSystem.Shared.Entities.Enum;

namespace UserManagementSystem.Web.Helpers
{
	public static class CustomConverter
	{
		public static List<SelectListItem> FromEmailTypesListToSelectedList(IEnumerable<EmailType> emailTypes, int selectedEmailTypeId)
		{
			List<SelectListItem> list = (
				from emailType in emailTypes
				select new SelectListItem()
				{
					Text = emailType.Description,
					Value = emailType.Id.ToString(),
					Selected = emailType.Id == selectedEmailTypeId
				}).ToList<SelectListItem>();
			return list;
		}

		public static List<SelectListItem> FromIntArrayToSelectListItems(int beginningNumber, int finiteNumber)
		{
			return CustomConverter.FromIntArrayToSelectListItems(beginningNumber, finiteNumber, 1, null, null);
		}

		public static List<SelectListItem> FromIntArrayToSelectListItems(int beginningNumber, int finiteNumber, int selectedValue, string displayFormat)
		{
			List<SelectListItem> selectListItems = CustomConverter.FromIntArrayToSelectListItems(beginningNumber, finiteNumber, 1, new int?(selectedValue), displayFormat);
			return selectListItems;
		}

		public static List<SelectListItem> FromIntArrayToSelectListItems(int beginningNumber, int finiteNumber, int interval, int selectedValue, string displayFormat)
		{
			List<SelectListItem> selectListItems = CustomConverter.FromIntArrayToSelectListItems(beginningNumber, finiteNumber, interval, new int?(selectedValue), displayFormat);
			return selectListItems;
		}

		private static List<SelectListItem> FromIntArrayToSelectListItems(int beginningNumber, int finiteNumber, int interval, int? selectedValue, string displayFormat)
		{
			ICollection<SelectListItem> selectListItems = new Collection<SelectListItem>();
			for (int i = beginningNumber; i <= finiteNumber; i += interval)
			{
				string str = i.ToString(displayFormat);
				ICollection<SelectListItem> selectListItems1 = selectListItems;
				SelectListItem selectListItem = new SelectListItem()
				{
					Text = str,
					Value = str
				};
				SelectListItem selectListItem1 = selectListItem;
				int? nullable = selectedValue;
				selectListItem1.Selected = (nullable.GetValueOrDefault() != i ? false : nullable.HasValue);
				selectListItems1.Add(selectListItem);
			}
			return selectListItems.ToList<SelectListItem>();
		}

		public static List<SelectListItem> FromPhoneTypesListToSelectedList(IEnumerable<PhoneType> phoneTypes, int selectedPhoneTypeId)
		{
			List<SelectListItem> list = (
				from phoneType in phoneTypes
				select new SelectListItem()
				{
					Text = phoneType.Description,
					Value = phoneType.Id.ToString(),
					Selected = phoneType.Id == selectedPhoneTypeId
				}).ToList<SelectListItem>();
			return list;
		}

		public static List<SelectListItem> FromPublicationsListToSelectedList(IEnumerable<Publication> availableList, List<Publication> selectedList)
		{
			List<SelectListItem> list = (
				from m in availableList
				select new SelectListItem()
				{
					Text = m.Name,
					Value = m.Id.ToString(),
					Selected = selectedList.Any<Publication>((Publication x) => x.Id == m.Id)
				}).ToList<SelectListItem>();
			return list;
		}

		public static List<SelectListItem> FromUmsClientRolesListToSelectedList()
		{
			List<UmsRoles> umsRoles = new List<UmsRoles>()
			{
				UmsRoles.Publisher,
				UmsRoles.Editor,
				UmsRoles.AuthorAe
			};
			List<SelectListItem> list = (
				from m in umsRoles
				select new SelectListItem()
				{
					Text = m.ToString(),
					Value = m.ToString()
				}).ToList<SelectListItem>();
			return list;
		}

		public static List<int> GetRangeList(int beginningNumber, int finiteNumber)
		{
			List<int> nums = new List<int>();
			for (int i = 1; i <= finiteNumber; i++)
			{
				nums.Add(i);
			}
			return nums;
		}
	}
}