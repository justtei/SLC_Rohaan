using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Logging;
using UserManagementSystem.Web.Models;

namespace UserManagementSystem.Web.Attributes
{
	public class PublicationsAttribute : ValidationAttribute
	{
		public PublicationsAttribute()
		{
		}

		public override bool IsValid(object value)
		{
			bool flag;
			try
			{
				List<PublicationViewModel> publicationViewModels = value as List<PublicationViewModel>;
				flag = (publicationViewModels == null ? false : publicationViewModels.Any<PublicationViewModel>((PublicationViewModel brand) => brand.Publications.Any<SelectListItem>((SelectListItem publ) => publ.Selected)));
			}
			catch (Exception exception)
			{
				Logger.Error("Error during executing 'Publications' validation attribute", exception);
				throw;
			}
			return flag;
		}
	}
}