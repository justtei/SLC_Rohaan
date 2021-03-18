using MSLivingChoices.Bcs.Admin.Components;
using MSLivingChoices.Entities.Admin.Enums;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels.Common;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using MSLivingChoices.Mvc.Uipc.Legacy;
using MSLivingChoices.Mvc.Uipc.Results;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace SLC_Rohaan.Controllers
{
	public class LocationController : Controller
	{
		public LocationController()
		{
		}

		public JsonResult GetCities(int stateId)
		{
			return new AllowGetJsonResult(LocationBc.Instance.GetCities(new long?((long)stateId)));
		}

		public JsonResult GetSelectedTypeCities(long stateId, SearchType selectedType)
		{
			List<SearchSelectListItemVm> viewModelCities = AdminViewModelsProvider.GetCities(stateId, selectedType);
			return new AllowedJsonResult()
			{
				Data = viewModelCities
			};
		}

		public JsonResult GetSelectedTypeStates(long countryId, SearchType selectedType)
		{
			List<SearchSelectListItemVm> viewModelStates = AdminViewModelsProvider.GetStates(countryId, selectedType);
			return new AllowedJsonResult()
			{
				Data = viewModelStates
			};
		}

		public JsonResult GetStates(int countryId)
		{
			return new AllowGetJsonResult(LocationBc.Instance.GetStates(new long?((long)countryId)));
		}

	}
}