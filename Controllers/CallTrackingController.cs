using MSLivingChoices.Bcs.Admin.Components;
using MSLivingChoices.Entities.Admin;
using MSLivingChoices.Mvc.Uipc.Admin.Filters;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using MSLivingChoices.Mvc.Uipc.Helpers;
using MSLivingChoices.Mvc.Uipc.Legacy;
using MSLivingChoices.Mvc.Uipc.Results;
using SLC_Rohaan.Helpers;
using System;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;

namespace SLC_Rohaan.Controllers
{
	[Authenticate]
	[CAuthorize("ilist")]
	public class CallTrackingController : Controller
	{
		public CallTrackingController()
		{
		}

		public ActionResult Details(long id)
		{
			CommunityCallTrackingPhonesVm result = AdminViewModelsProvider.GetCommunityCallTrackingPhonesVm(id);
			//if (result == null)
			//{
			//	return base.NotFound();
			//}
			return base.View(result);
		}

		//[CallTrackingDetailsPartialValidation]
		[HttpPost]
		public JsonResult Details(CommunityCallTrackingPhonesVm model)
		{
			if (!base.ModelState.IsValid)
			{
				return new AllowGetJsonResult(new { success = false, errors = ModelStateHelper.GetModelStateErrors(base.ModelState) });
			}
			CallTrackingBc.Instance.ProvisionPhonesAndSave(model.CommunityId.Value, (
				from p in model.ToEntity()
				where !string.IsNullOrEmpty(p.Phone)
				select p).ToList<CallTrackingPhone>());
			return new AllowGetJsonResult(new { success = true, url = base.Url.Action("Grid") });
		}

		public ActionResult Grid(int? pageNumber, int? pageSize)
		{
			return base.View(AdminViewModelsProvider.GetCallTrackingPhonesGridVm(pageNumber, pageSize));
		}

		public JsonResult JsonGrid(int? pageNumber, int? pageSize)
		{
			GridVm<CallTrackingPhoneForGridVm> grid = AdminViewModelsProvider.GetCallTrackingPhonesGridVm(pageNumber, pageSize);
			return new AllowedJsonResult()
			{
				Data = new { success = true, grid = grid }
			};
		}

		[HttpGet]
		public ActionResult ValidateCallTrackingPhones()
		{
			CallTrackingBc.Instance.ValidateCallTrackingPhones();
			return base.RedirectToAction("Grid");
		}
	}
}