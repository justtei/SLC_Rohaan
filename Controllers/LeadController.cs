using MSLivingChoices.Localization;
using MSLivingChoices.Mvc.Uipc.Client.ViewModels;
using MSLivingChoices.Mvc.Uipc.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;

namespace SLC_Rohaan.Controllers
{
	public class LeadController : Controller
	{
		public LeadController()
		{
		}

		public JsonResult ProcessLead(LeadFormVm leadFormVm)
		{
			LeadConfirmationVm model = new LeadConfirmationVm();
			JsonNetResult result = new JsonNetResult(model);
			if (base.ModelState.IsValid)
			{
				model.Success = true;
				model.Message = StaticContent.Txt_LeadConfirmationMessage;
				return result;
			}
			IEnumerable<string> errorMessages = base.ModelState.Values.SelectMany<System.Web.Mvc.ModelState, ModelError>((System.Web.Mvc.ModelState state) => state.Errors).Select<ModelError, string>((ModelError error) => error.ErrorMessage);
			model.Success = false;
			model.Message = string.Join(".\n", errorMessages);
			return result;
		}
	}
}