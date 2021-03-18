using System;
using System.Runtime.CompilerServices;
using System.Web;
using System.Web.Mvc;
using UserManagementSystem.Configuration;

namespace UserManagementSystem.Web.Helpers
{
	public static class UrlHelpers
	{
		public static IHtmlString Css(this UrlHelper urlHelper, string filePath)
		{
			string str = urlHelper.Content(string.Format("~/Content/{0}", filePath));
			string str1 = string.Format("<link href=\"{0}?version={1}\" rel=\"stylesheet\" type=\"text/css\" />", str, ConfigurationManager.CssJsVersion);
			return new HtmlString(str1);
		}

		public static IHtmlString Script(this UrlHelper urlHelper, string filePath)
		{
			string str = urlHelper.Content(string.Format("~/Scripts/{0}", filePath));
			string str1 = string.Format("<script src=\"{0}?version={1}\" type=\"text/javascript\"></script>", urlHelper.Content(str), ConfigurationManager.CssJsVersion);
			return new HtmlString(str1);
		}

		public static string StaticPageLink(this UrlHelper urlHelper, string pageName)
		{
			string str = string.Format("{0}/{1}", HttpContext.Current.Request.ApplicationPath, pageName);
			return str;
		}
	}
}