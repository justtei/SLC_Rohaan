//using MSLivingChoices.Mvc.Uipc.Client.Enums;
//using MSLivingChoices.Mvc.Uipc.Client.ViewModels;
//using MSLivingChoices.Mvc.Uipc.Client.ViewModelsProviders;
//using System;
//using System.Web;
//using System.Web.Mvc;

//namespace SLC_Rohaan.Controllers
//{
//	public class Controller : Controller
//	{
//		public Controller()
//		{
//		}

//		protected override void HandleUnknownAction(string actionName)
//		{
//			this.NotFound();
//		}

//		public ActionResult Http301Redirect(string url)
//		{
//			this.HttpContext.Response.RedirectPermanent(url, false);
//			this.HttpContext.ApplicationInstance.CompleteRequest();
//			return new EmptyResult();
//		}

//		public ActionResult NotFound()
//		{
//			this.HttpContext.Response.Clear();
//			this.HttpContext.Response.StatusCode = (404);
//			this.HttpContext.Response.TrySkipIisCustomErrors = (true);
//			return base.View("~/Views/Client/Error/Error.cshtml", ClientViewModelsProvider.GetStaticContent(PageType.Error404));
//		}
//	}
//}