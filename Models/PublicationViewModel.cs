using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Models
{
	public class PublicationViewModel
	{
		public BrandType Brand
		{
			get;
			set;
		}

		public bool BrandSelected
		{
			get;
			set;
		}

		public List<SelectListItem> Publications
		{
			get;
			set;
		}

		public PublicationViewModel() : this(new List<SelectListItem>(), new BrandType(), false)
		{
		}

		public PublicationViewModel(List<SelectListItem> publications, BrandType brand, bool brandSelected = false)
		{
			this.Brand = brand;
			this.BrandSelected = brandSelected;
			this.Publications = publications;
		}

		public List<Publication> ToBusinessEntity()
		{
			List<Publication> publications = new List<Publication>();
			foreach (SelectListItem selectListItem in 
				from p in this.Publications
				where p.Selected
				select p)
			{
				Publication publication = new Publication()
				{
					Id = Convert.ToInt32(selectListItem.Value),
					Name = selectListItem.Text
				};
				publications.Add(publication);
			}
			return publications;
		}
	}
}