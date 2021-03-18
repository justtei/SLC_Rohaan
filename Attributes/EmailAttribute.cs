using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web.Mvc;
using UserManagementSystem.Localization;

namespace UserManagementSystem.Web.Attributes
{
	public class EmailAttribute : ValidationAttribute, IClientValidatable
	{
		private const string Pattern = "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";

		public EmailAttribute()
		{
			base.ErrorMessageResourceName = ("InvalidEmail");
			base.ErrorMessageResourceType = (Type.GetTypeFromHandle(typeof(ErrorMessages).TypeHandle));
		}

		public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
		{
			ModelClientValidationRule modelClientValidationRule = new ModelClientValidationRule()
			{
				ValidationType = "email",
				ErrorMessage = base.ErrorMessageString
			};
			yield return modelClientValidationRule;
		}

		public override bool IsValid(object value)
		{
			bool flag;
			flag = ((value == null ? false : !(value.ToString().Trim() == string.Empty)) ? Regex.IsMatch(value.ToString(), "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$", RegexOptions.IgnoreCase) : true);
			return flag;
		}
	}
}