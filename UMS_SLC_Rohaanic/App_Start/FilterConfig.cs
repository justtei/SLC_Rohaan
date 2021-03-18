using System.Web;
using System.Web.Mvc;

namespace UMS_SLC_Rohaanic
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
