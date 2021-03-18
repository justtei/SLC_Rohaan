using MSLivingChoices.Bcs.Admin.Components;
using MSLivingChoices.Entities.Admin;
using MSLivingChoices.Entities.Admin.Enums;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using MSLivingChoices.Mvc.Uipc.Helpers;
using MSLivingChoices.Mvc.Uipc.Legacy;
using MSLivingChoices.Mvc.Uipc.Results;
using SLC_Rohaan.Helpers;
using System;
using System.Web.Mvc;

namespace SLC_Rohaan.Controllers
{
	[Authenticate]
	[CAuthorize("ilist")]
	public class OwnerController : Controller
	{
		public ActionResult Grid(OwnerType type, int? pageNumber, int? pageSize)
		{
			OwnerGridVm<OwnerForGridVm> ownersGrid = AdminViewModelsProvider.GetOwnerGridVm(type, pageNumber, pageSize);
			return View(ownersGrid);
		}

		public JsonResult JsonGrid(OwnerType type, int? pageNumber, int? pageSize)
		{
			OwnerGridVm<OwnerForGridVm> ownersGrid = AdminViewModelsProvider.GetOwnerGridVm(type, pageNumber, pageSize);
			return new AllowedJsonResult
			{
				Data = new
				{
					success = true,
					grid = ownersGrid
				}
			};
		}

		[HttpGet]
		public ActionResult New(OwnerType type)
		{
			NewOwnerVm newOwnerViewModel = AdminViewModelsProvider.GetNewOwnerVm(type);
			return View(newOwnerViewModel);
		}

		[HttpPost]
		public JsonResult New(NewOwnerVm viewModel)
		{
			if (!base.ModelState.IsValid)
			{
				return new AllowGetJsonResult(new
				{
					success = false,
					errors = ModelStateHelper.GetModelStateErrors(base.ModelState)
				});
			}
			Owner owner = viewModel.ToEntity(viewModel.OwnerType);
			OwnerBc.Instance.SaveNewOwner(owner);
			return new AllowGetJsonResult(new
			{
				success = true,
				url = base.Url.Action("Grid", new
				{
					type = viewModel.OwnerType
				})
			});
		}

		[HttpGet]
		public ActionResult Edit(long id)
		{
			NewOwnerVm newOwnerViewModel = AdminViewModelsProvider.GetNewOwnerVm(OwnerBc.Instance.GetById(id));
			return View(newOwnerViewModel);
		}

		[HttpPost]
		public ActionResult Edit(NewOwnerVm viewModel)
		{
			if (!base.ModelState.IsValid)
			{
				return new AllowGetJsonResult(new
				{
					success = false,
					errors = ModelStateHelper.GetModelStateErrors(base.ModelState)
				});
			}
			Owner owner = viewModel.ToEntity(viewModel.OwnerType);
			OwnerBc.Instance.SaveNewOwner(owner);
			return new AllowGetJsonResult(new
			{
				success = true,
				url = base.Url.Action("Grid", new
				{
					type = viewModel.OwnerType
				})
			});
		}
	}

}