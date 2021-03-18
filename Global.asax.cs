//using MSLivingChoices.Bcs.Client.Components;
//using MSLivingChoices.Configuration;
//using MSLivingChoices.Entities.Admin;
//using MSLivingChoices.Entities.Client.DisplayOptions;
//using MSLivingChoices.Logging;
//using MSLivingChoices.Logging.Messages;
//using MSLivingChoices.Mvc.Uipc;
//using MSLivingChoices.Mvc.Uipc.Admin.ModelBinders;
//using MSLivingChoices.Mvc.Uipc.Client.Attributes;
//using MSLivingChoices.Mvc.Uipc.Client.Enums;
//using MSLivingChoices.Mvc.Uipc.Client.Helpers;
//using MSLivingChoices.Mvc.Uipc.Client.Helpers.Core;
//using MSLivingChoices.Mvc.Uipc.Client.ModelBinders;
//using MSLivingChoices.Mvc.Uipc.Client.ViewModels;
//using MSLivingChoices.Mvc.Uipc.HttpHandlers;
//using MSLivingChoices.Mvc.Uipc.Legacy;
using MSLivingChoices.Bcs.Client.Components;
using MSLivingChoices.Configuration;
using MSLivingChoices.Entities.Admin;
using MSLivingChoices.Entities.Client.DisplayOptions;
using MSLivingChoices.Logging.Messages;
using MSLivingChoices.Mvc.Uipc.Admin.ModelBinders;
using MSLivingChoices.Mvc.Uipc.Client.Enums;
using MSLivingChoices.Mvc.Uipc.Client.Helpers;
using MSLivingChoices.Mvc.Uipc.Client.ModelBinders;
using MSLivingChoices.Mvc.Uipc.Client.ViewModels;
using MSLivingChoices.Mvc.Uipc.HttpHandlers;
using MSLivingChoices.Mvc.Uipc.Legacy;
using MSLivingChoices.Session;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace SLC_Rohaan
{
	public class MvcApplication : HttpApplication
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
		}

		private static void RegisterBundles(BundleCollection bundles)
		{
			BundleTable.EnableOptimizations = true;//ConfigurationManager.Instance.IsEnabledJsCssOptimization;
			Bundle libBundle = new ScriptBundle("~/scripts/bundle/lib")
				.Include("~/scripts/lib/popper/popper.min.js")
				.Include("~/scripts/lib/bootstrap/bootstrap.min.js")
				.Include("~/scripts/lib/jquery-3.5.1.min.js")
				.Include("~/scripts/lib/jquery-ui.datepicker.js")
				.Include("~/scripts/lib/jquery-ui.js")
				.Include("~/scripts/lib/knockout-3.2.0.js")
				.Include("~/scripts/lib/knockout.validation.js")
				.Include("~/scripts/lib/moment.js")
				.Include("~/scripts/injector.js")
				.Include("~/scripts/libInject.js");
			Bundle clientBundle = new ScriptBundle("~/scripts/bundle/client").IncludeDirectory("~/scripts/client", "*.js", searchSubdirectories: true).Include("~/scripts/client.js").Include("~/scripts/jquery.appear.js");
			bundles.Add(libBundle);
			bundles.Add(clientBundle);
		}

		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
			routes.IgnoreRoute("favicon.ico");
			routes.MapRoute("iListDefault", "iList", new
			{
				controller = "Community",
				action = "Grid"
			});
			routes.MapRoute("Categories", "iList/Categories", new
			{
				controller = "Category",
				action = "CategoryList"
			});
			routes.MapRoute("Amenities", "iList/Amenities", new
			{
				controller = "Category",
				action = "AmenityList"
			});
			routes.MapRoute("iList", "iList/{controller}/{action}", new
			{
				controller = "CallTracking|Community|ServiceProvider|Owner|Types"
			});
			routes.MapRoute(
				name: "Default",
				url: "{controller}/{action}/{id}",
				defaults: new { controller = "Account", action = "LogIn", id = UrlParameter.Optional }
			);
            routes.MapRoute("TermsOfUse", "terms-of-use", new
            {
                controller = "Client",
                action = "TermsOfUse",
                pageType = PageType.TermsOfUse
            });
            routes.MapRoute("PrivacyPolicy", "privacy-policy", new
            {
                controller = "Client",
                action = "PrivacyPolicy",
                pageType = PageType.PrivacyPolicy
            });
            routes.MapRoute("Ebook", "ebook", new
            {
                controller = "Client",
                action = "Ebook",
                pageType = PageType.Ebook
            });
            PageType.ShcDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Map(new
                {
                    controller = "Client",
                    action = "CommunityDetails"
                });
            PageType.AacDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Map(new
                {
                    controller = "Client",
                    action = "CommunityDetails"
                });
            PageType.AahDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Map(new
                {
                    controller = "Client",
                    action = "CommunityDetails"
                });
            PageType.ServiceProviderDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Map(new
                {
                    controller = "Client",
                    action = "ServiceProviderDetails"
                });
            PageType.ShcDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Print()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunity"
                });
            PageType.AacDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Print()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunity"
                });
            PageType.AahDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Print()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunity"
                });
            PageType.ServiceProviderDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .Print()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintServiceProvider"
                });
            PageType.ShcDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintCoupon()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunityCoupon"
                });
            PageType.AacDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintCoupon()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunityCoupon"
                });
            PageType.AahDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintCoupon()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunityCoupon"
                });
            PageType.ServiceProviderDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintCoupon()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintServiceProviderCoupon"
                });
            PageType.ShcDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintDirection()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunityDirection"
                });
            PageType.AacDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintDirection()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunityDirection"
                });
            PageType.AahDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintDirection()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintCommunityDirection"
                });
            PageType.ServiceProviderDetails.FluentRoute().State().City()
                .Name()
                .DetailsId()
                .PrintDirection()
                .Map(new
                {
                    controller = "Client",
                    action = "PrintServiceProviderDirection"
                });
            PageType.ShcByType.FluentRoute().Map(new
            {
                controller = "Client",
                action = "SearchTypeStub"
            });
            PageType.AacByType.FluentRoute().Map(new
            {
                controller = "Client",
                action = "SearchTypeStub"
            });
            PageType.AahByType.FluentRoute().Map(new
            {
                controller = "Client",
                action = "SearchTypeStub"
            });
            PageType.ServiceProvidersByType.FluentRoute().Map(new
            {
                controller = "Client",
                action = "SearchTypeStub"
            });
            PageType.ShcByState.FluentRoute().State().Map(new
            {
                controller = "Client",
                action = "SearchCommunities",
                pageNumber = 1
            });
            PageType.ShcByState.FluentRoute().State().WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.AacByState.FluentRoute().State().Map(new
            {
                controller = "Client",
                action = "SearchCommunities",
                pageNumber = 1
            });
            PageType.AacByState.FluentRoute().State().WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.AahByState.FluentRoute().State().Map(new
            {
                controller = "Client",
                action = "SearchCommunities",
                pageNumber = 1
            });
            PageType.AahByState.FluentRoute().State().WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.ServiceProvidersByState.FluentRoute().State().Map(new
            {
                controller = "Client",
                action = "SearchServiceProviders",
                pageNumber = 1
            });
            PageType.ServiceProvidersByState.FluentRoute().State().WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchServiceProviders"
                });
            PageType.ShcByZip.FluentRoute().State().Zip()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities",
                    pageNumber = 1
                });
            PageType.ShcByZip.FluentRoute().State().Zip()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.AacByZip.FluentRoute().State().Zip()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities",
                    pageNumber = 1
                });
            PageType.AacByZip.FluentRoute().State().Zip()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.AahByZip.FluentRoute().State().Zip()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities",
                    pageNumber = 1
                });
            PageType.AahByZip.FluentRoute().State().Zip()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.ServiceProvidersByZip.FluentRoute().State().Zip()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchServiceProviders",
                    pageNumber = 1
                });
            PageType.ServiceProvidersByZip.FluentRoute().State().Zip()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchServiceProviders"
                });
            PageType.ShcByCity.FluentRoute().State().City()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities",
                    pageNumber = 1
                });
            PageType.ShcByCity.FluentRoute().State().City()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.AacByCity.FluentRoute().State().City()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities",
                    pageNumber = 1
                });
            PageType.AacByCity.FluentRoute().State().City()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.AahByCity.FluentRoute().State().City()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities",
                    pageNumber = 1
                });
            PageType.AahByCity.FluentRoute().State().City()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchCommunities"
                });
            PageType.ServiceProvidersByCity.FluentRoute().State().City()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchServiceProviders",
                    pageNumber = 1
                });
            PageType.ServiceProvidersByCity.FluentRoute().State().City()
                .WithPaging()
                .Map(new
                {
                    controller = "Client",
                    action = "SearchServiceProviders"
                });
            routes.Add("IdOnly", new Route("{id}", new ShortenedRouteHandler()));
            routes.Add("CommunityId", new Route("community/{id}", new ShortenedRouteHandler()));
            routes.Add("ServiceId", new Route("service/{id}", new ShortenedRouteHandler()));
            routes.Add("Images", new Route("image/{name}", new ImageRouteHandler()));
            routes.MapRoute("Index", string.Empty, new
            {
                controller = "Account",
                action = "LogIn",
                pageType = 1
            });
            //routes.MapRoute("Default", "api/{controller}/{action}");
            //routes.MapRoute("NotFound", "Error", new
            //{
            //    controller = "Base",
            //    action = "NotFound"
            //});
            //routes.MapRoute("Error", "{*url}", new
            //{
            //    controller = "Base",
            //    action = "NotFound"
            //});
        }

		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();
			RegisterGlobalFilters(GlobalFilters.Filters);
			RegisterRoutes(RouteTable.Routes);
			RegisterBundles(BundleTable.Bundles);
			ModelBinders.Binders.Add(typeof(double), new DoubleModelBinder());
			ModelBinders.Binders.Add(typeof(CommunityGridFilter), new CommunityGridFilterModelBinder());
			ModelBinders.Binders.Add(typeof(ServiceProviderGridFilter), new ServiceProviderGridFilterModelBinder());
			ModelBinders.Binders.Add(typeof(CommunitiesSearchVm), new CommunitiesSearchVmModelBinder());
			ModelBinders.Binders.Add(typeof(ServiceProvidersSearchVm), new ServiceProvidersSearchVmModelBinder());
			ModelBinders.Binders.Add(typeof(SearchTypeStubSearchVm), new SearchVmBinder());
			SetupDbRelatedConfiguration();
			if (ConfigurationManager.Instance.IsEnabledDbCache)
			{
				SqlDependency.Start(ConfigurationManager.Instance.MlcSlcConnectionString);
			}
			//ControllerBuilder.Current.SetControllerFactory(new MlcslcControllerFactory(ControllerBuilder.Current.GetControllerFactory()));
			LogMessages.CheckDuplicateMessagesKeys();
		}

		protected void Session_Start()
		{
			SessionManager.PutDataToSession(SessionKeys.CurrentCulture, new CultureInfo("en-US"));
		}

		public void Application_AcquireRequestState(object sender, EventArgs e)
		{
			CultureInfo currentCulture = SessionManager.GetDataFromSession<CultureInfo>(SessionKeys.CurrentCulture) ?? new CultureInfo("en-US");
			Thread.CurrentThread.CurrentCulture = currentCulture;
			Thread.CurrentThread.CurrentUICulture = currentCulture;
		}

		//protected void Application_Error(object sender, EventArgs e)
		//{
		//	HttpContext context = HttpContext.Current;
		//	HttpException exception = context.Server.GetLastError() as HttpException;
		//	if (exception != null)
		//	{
		//		Logger.Error(LogMessages.MvcUi.GlobalAsax.WebApplicationError, exception);
		//		if (exception.GetHttpCode() == 404)
		//		{
		//			ControllerBuilder.Current.GetControllerFactory().CreateController(context.Request.RequestContext, "Error").Execute(new RequestContext(routeData: new RouteData
		//			{
		//				Values =
		//				{
		//					{
		//						"controller",
		//						(object)"Client"
		//					},
		//					{
		//						"action",
		//						(object)"NotFound"
		//					}
		//				}
		//			}, httpContext: context.Request.RequestContext.HttpContext));
		//			context.Server.ClearError();
		//		}
		//	}
		//}

		private void SetupDbRelatedConfiguration()
		{
			Dictionary<int, List<CompetitiveItem>> configuration = CommonBc.Instance.GetCompetitiveItems();
			if (configuration == null)
			{
				return;
			}
			ConfigurationManager.Instance.CompetitiveItems = new Dictionary<int, List<string>>();
			foreach (KeyValuePair<int, List<CompetitiveItem>> item in configuration)
			{
				ConfigurationManager.Instance.CompetitiveItems.Add(item.Key, item.Value.Select((CompetitiveItem v) => v.Key).ToList());
			}
		}
	}
}