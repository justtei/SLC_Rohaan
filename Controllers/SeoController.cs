using MSLivingChoices.Entities.Admin.Enums;
using MSLivingChoices.Mvc.Uipc.Results;
using System;
using System.Web.Mvc;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels.Common;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using SLC_Rohaan.Helpers;

namespace SLC_Rohaan.Controllers
{
	[Authenticate]
	[CAuthorize("admin")]
	public class SeoController : Controller
	{
		public SeoController()
		{
		}

		[HttpPost]
		public JsonResult GetCityMetadata(SeoVm model)
		{
			return new AllowGetJsonResult(AdminViewModelsProvider.GetSeoMetadata(model));
		}

		public JsonResult GetCountries()
		{
			return new AllowGetJsonResult(AdminViewModelsProvider.GetCountriesForSeo());
		}

		[HttpPost]
		public JsonResult GetCountryMetadata(SeoVm model)
		{
			SearchType? searchType = model.SearchType;
			return new AllowGetJsonResult(new { states = AdminViewModelsProvider.GetStatesForSeo(searchType.Value, model.CountryId), metaData = AdminViewModelsProvider.GetSeoMetadata(model) });
		}

		[HttpPost]
		public JsonResult GetIndexMetadata(SeoVm model)
		{
			return new AllowGetJsonResult(AdminViewModelsProvider.GetSeoMetadata(model));
		}

		[HttpPost]
		public JsonResult GetStateMetadata(SeoVm model)
		{
			SearchType? searchType = model.SearchType;
			return new AllowGetJsonResult(new { cities = AdminViewModelsProvider.GetCitiesForSeo(searchType.Value, model.StateId), metaData = AdminViewModelsProvider.GetSeoMetadata(model) });
		}

		public ActionResult Index()
		{
			return base.View(new SeoVm());
		}

		[HttpPost]
		public JsonResult SaveMetaData(SeoVm model)
		{
			return new AllowGetJsonResult((object)AdminViewModelsProvider.SaveSeoMetaData(model));
		}
	}
}