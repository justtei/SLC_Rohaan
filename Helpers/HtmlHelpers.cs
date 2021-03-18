using System;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace UserManagementSystem.Web.Helpers
{
	public static class HtmlHelpers
	{
		public static void RenderPartialFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string partialViewName)
		{
			htmlHelper.RenderPartialFor<TModel, TProperty>(expression, partialViewName, null);
		}

		public static void RenderPartialFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string partialViewName, string additionalPrefix)
		{
			string str;
			string expressionText = ExpressionHelper.GetExpressionText(expression);
			object model = ModelMetadata.FromLambdaExpression<TModel, TProperty>(expression, htmlHelper.ViewData).Model;
			if (!string.IsNullOrWhiteSpace(additionalPrefix))
			{
				str = (!string.IsNullOrWhiteSpace(expressionText) ? string.Format("{0}.{1}", additionalPrefix, expressionText) : additionalPrefix);
			}
			else
			{
				str = expressionText;
			}
			ViewDataDictionary viewDataDictionaries = new ViewDataDictionary(htmlHelper.ViewData)
			{
				TemplateInfo = new TemplateInfo()
				{
					HtmlFieldPrefix = str
				}
			};
			htmlHelper.RenderPartial(partialViewName, model, viewDataDictionaries);
		}
	}
}