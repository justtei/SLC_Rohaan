using MSLivingChoices.Mvc.Uipc.Admin.Helpers;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModels.Common;
using MSLivingChoices.Mvc.Uipc.Admin.ViewModelsProviders;
using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace SLC_Rohaan.Controllers
{
	public class ImageController : Controller
	{
		public ImageController()
		{
		}

		[HttpPost]
		public ActionResult PreviewImage()
		{
			ImagePreviewVm viewModel = new ImagePreviewVm();
			byte[] bytes = new byte[0];
			viewModel.Mime = "image";
			if (this.Request .Files.Count >= 1)
			{
				bytes = new byte[this.Request.Files[(0)].ContentLength];
				this.Request.Files[0].InputStream.Read(bytes, 0, (int)bytes.Length);
				viewModel.Mime = this.Request .Files[(0)].ContentType;
			}
			viewModel.Message = Convert.ToBase64String(bytes, Base64FormattingOptions.InsertLineBreaks);
			JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
			javaScriptSerializer.MaxJsonLength =(4145728);
			javaScriptSerializer.RecursionLimit = (100);
			JavaScriptSerializer serializer = javaScriptSerializer;
			return new ContentResult()
			{
				Content = serializer.Serialize(new { mime = viewModel.Mime, message = viewModel.Message }),
				ContentType = "text/html"
			};
		}

		[HttpPost]
		public ActionResult Upload(UploadImageVm model)
		{
			JsonVm json = new JsonVm();
			ImageVm result;
			if (base.ModelState.IsValid && !string.IsNullOrWhiteSpace(model.Base64Image))
			{
				result = AdminViewModelsProvider.UploadImage(model);
			}
			else
			{
				result = new ImageVm
				{
					Name = "error.png"
				};
				result.Url = MslcUrlBuilder.ImageHandlerUrl(result);
			}
			json.Data = JsHelper.MapToJson(result);
			return PartialView("Partial/_Json", json);
		}
	}
}