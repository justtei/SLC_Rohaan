using MSLivingChoices.Bcs.Admin.Components;
using MSLivingChoices.Entities.Admin;
using MSLivingChoices.Entities.Admin.Enums;
using MSLivingChoices.Localization;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using MSLivingChoices.Mvc.Uipc.Helpers;
using MSLivingChoices.Mvc.Uipc.Legacy;
using MSLivingChoices.Mvc.Uipc.Results;
using SLC_Rohaan.Helpers;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace SLC_Rohaan.Controllers
{
	[Authenticate]
	[CAuthorize("admin")]
	public class ServiceProviderController : Controller
	{
		public ServiceProviderController()
		{
		}

		public JsonResult ChangeFeatureDates(long serviceProviderId, DateTime? startDate, DateTime? endDate)
		{
			ServiceProviderBc.Instance.ChangeFeatureDates(serviceProviderId, startDate, endDate);
			return new AllowedJsonResult()
			{
				Data = new { success = true }
			};
		}

		public JsonResult ChangePackageType(long serviceProviderId, PackageType packageType)
		{
			ServiceProviderBc.Instance.ChangePackageType(serviceProviderId, packageType);
			return new AllowedJsonResult()
			{
				Data = new { success = true }
			};
		}

		public JsonResult ChangePublishDates(long serviceProviderId, DateTime? startDate, DateTime? endDate)
		{
			ServiceProviderBc.Instance.ChangePublishDates(serviceProviderId, startDate, endDate);
			return new AllowedJsonResult()
			{
				Data = new { success = true }
			};
		}

		public JsonResult ChangeSeniorHousingAndCareCategories(long serviceProviderId, List<long> seniorHousingAndCareCategoryIds)
		{
			ServiceProviderBc.Instance.ChangeServiceCategories(serviceProviderId, seniorHousingAndCareCategoryIds);
			return new AllowedJsonResult()
			{
				Data = new { success = true }
			};
		}

		public ActionResult Edit(long id)
		{
			EditServiceProviderVm model = AdminViewModelsProvider.GetEditServiceProviderVm(id);
			//if (model == null)
			//{
			//	return base.();
			//}
			return base.View(model);
		}

		[HttpPost]
		public ActionResult Edit(EditServiceProviderVm editServiceProvider)
		{
			ActionResult allowGetJsonResult;
			bool flag;
			if (!base.ModelState.IsValid)
			{
				return new AllowGetJsonResult(new { success = false, errors = ModelStateHelper.GetModelStateErrors(base.ModelState) });
			}
			flag = (!editServiceProvider.Address.Location.Longitude.HasValue ? false : editServiceProvider.Address.Location.Latitude.HasValue);
			if (editServiceProvider.AddressValidation.ValidationItems == null && !flag)
			{
				AddressValidationVm addressValidation = AdminViewModelsProvider.GetAddressValidationVm(editServiceProvider.Address);
				if (!addressValidation.IsAddressValid)
				{
					return new AllowGetJsonResult(new { success = false, addressValidation = addressValidation });
				}
				editServiceProvider.AddressValidation = addressValidation;
			}
			ServiceProvider serviceProvider = editServiceProvider.ToEntity();
			try
			{
				ServiceProviderBc.Instance.SaveEditedServiceProvider(serviceProvider);
				return new AllowGetJsonResult(new { success = true, url = base.Url.Action("Grid") });
			}
			catch (InvalidOperationException invalidOperationException)
			{
				InvalidOperationException exception = invalidOperationException;
				allowGetJsonResult = new AllowGetJsonResult(new { success = false, callTrackingErrorMessage = string.Format(ErrorMessages.CallTrackingProvisioningError, exception.Message) });
			}
			return allowGetJsonResult;
		}

		public ActionResult Grid(int? pageNumber, int? pageSize, ServiceProviderGridSortByOption? sortBy, OrderBy? orderBy, ServiceProviderGridFilter filter)
		{
			GridVm<ServiceProviderForGridVm> serviceProviderGrid = AdminViewModelsProvider.GetServiceProviderGridVm(pageNumber, pageSize, sortBy, orderBy, filter);
			return base.View(serviceProviderGrid);
		}

		public JsonResult JsonGrid(int? pageNumber, int? pageSize, ServiceProviderGridSortByOption? sortBy, OrderBy? orderBy, ServiceProviderGridFilter filter)
		{
			GridVm<ServiceProviderForGridVm> grid = AdminViewModelsProvider.GetServiceProviderGridVm(pageNumber, pageSize, sortBy, orderBy, filter);
			return new AllowedJsonResult()
			{
				Data = new { success = true, grid = grid }
			};
		}

		public ActionResult New()
		{
			return base.View(AdminViewModelsProvider.GetNewServiceProviderVm());
		}

		[HttpPost]
		public JsonResult New(NewServiceProviderVm newServiceProvider)
		{
			JsonResult allowGetJsonResult;
			if (!base.ModelState.IsValid)
			{
				return new AllowGetJsonResult(new { success = false, errors = ModelStateHelper.GetModelStateErrors(base.ModelState) });
			}
			if (newServiceProvider.AddressValidation.ValidationItems == null)
			{
				AddressValidationVm addressValidation = AdminViewModelsProvider.GetAddressValidationVm(newServiceProvider.Address);
				if (!addressValidation.IsAddressValid)
				{
					return new AllowGetJsonResult(new { success = false, addressValidation = addressValidation });
				}
				newServiceProvider.AddressValidation = addressValidation;
			}
			ServiceProvider serviceProvider = newServiceProvider.ToEntity();
			try
			{
				ServiceProviderBc.Instance.SaveNewServiceProvider(serviceProvider);
				return new AllowGetJsonResult(new { success = true, url = base.Url.Action("Grid") });
			}
			catch (InvalidOperationException invalidOperationException)
			{
				InvalidOperationException exception = invalidOperationException;
				allowGetJsonResult = new AllowGetJsonResult(new { success = false, callTrackingErrorMessage = string.Format(ErrorMessages.CallTrackingProvisioningError, exception.Message) });
			}
			return allowGetJsonResult;
		}
	}
}