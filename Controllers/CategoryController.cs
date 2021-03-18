using MSLivingChoices.Entities.Admin.Enums;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using MSLivingChoices.Mvc.Uipc.Results;
using SLC_Rohaan.Helpers;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace SLC_Rohaan.Controllers
{
	[Authenticate]
	[CAuthorize("admin")]
	public class CategoryController : Controller
	{
		public CategoryController()
		{
		}
		public ActionResult AmenityList()
		{
			return base.View(AdminViewModelsProvider.GetEditableAmenities());
		}
		public ActionResult CategoryList()
		{
			return base.View(AdminViewModelsProvider.GetEditableCategories());
		}
		[HttpGet]
		public ActionResult GetAmenityTypes(AmenityType categoryClass)
		{
			return new AllowGetJsonResult(AdminViewModelsProvider.GatEditAmenitiesVm(categoryClass));
		}
		[HttpGet]
		public JsonResult GetCategoryTypes(AdditionalInfoClass categoryClass)
		{
			return new AllowGetJsonResult(AdminViewModelsProvider.GatAdditionalInfoTypesVm(categoryClass));
		}
		[HttpPost]
		public JsonResult SaveAmenityTypes(EditAmenitiesVm model)
		{
			AdminViewModelsProvider.SaveAmenityTypes(model);
			return new AllowGetJsonResult(new { success = true, url = base.Url.Action("AmenityList") });
		}

		[HttpPost]
		public JsonResult SaveCategoryTypes(AdditionalInfoTypesVm model)
		{
			AdminViewModelsProvider.SaveCategoryTypes(model);
			return new AllowGetJsonResult(new { success = true, url = base.Url.Action("CategoryList") });
		}
	}
}