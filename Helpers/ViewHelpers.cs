using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Shared.Entities;

namespace UserManagementSystem.Web.Helpers
{
	public static class ViewHelpers
	{
		public static SelectListItem GetSelectedListItem(Country state, string selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = state.Name == selected,
				Text = state.Name,
				Value = state.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(State state, string selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = state.Name == selected,
				Text = state.Name,
				Value = state.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(City city, string selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = city.Name == selected,
				Text = city.Name,
				Value = city.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(Publication publication, string selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = publication.Name == selected,
				Text = publication.Name,
				Value = publication.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(Country state, int selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = state.Id == selected,
				Text = state.Name,
				Value = state.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(State state, int selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = state.Id == selected,
				Text = state.Name,
				Value = state.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(City city, int selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = city.Id == selected,
				Text = city.Name,
				Value = city.Id.ToString()
			};
			return selectListItem;
		}

		public static SelectListItem GetSelectedListItem(Publication publication, int selected)
		{
			SelectListItem selectListItem = new SelectListItem()
			{
				Selected = publication.Id == selected,
				Text = publication.Name,
				Value = publication.Id.ToString()
			};
			return selectListItem;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<Country> countries)
		{
			List<SelectListItem> selectListItems = countries.ConvertAll<SelectListItem>((Country item) => ViewHelpers.GetSelectedListItem(item, null));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<State> states)
		{
			List<SelectListItem> selectListItems = states.ConvertAll<SelectListItem>((State item) => ViewHelpers.GetSelectedListItem(item, null));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<City> cities)
		{
			List<SelectListItem> selectListItems = cities.ConvertAll<SelectListItem>((City item) => ViewHelpers.GetSelectedListItem(item, null));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<Publication> publications)
		{
			List<SelectListItem> selectListItems = publications.ConvertAll<SelectListItem>((Publication item) => ViewHelpers.GetSelectedListItem(item, null));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<State> states, string selected)
		{
			List<SelectListItem> selectListItems = states.ConvertAll<SelectListItem>((State item) => ViewHelpers.GetSelectedListItem(item, selected));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<City> cities, string selected)
		{
			List<SelectListItem> selectListItems = cities.ConvertAll<SelectListItem>((City item) => ViewHelpers.GetSelectedListItem(item, selected));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<Country> states, int selected)
		{
			List<SelectListItem> selectListItems = states.ConvertAll<SelectListItem>((Country item) => ViewHelpers.GetSelectedListItem(item, selected));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<State> states, int selected)
		{
			List<SelectListItem> selectListItems = states.ConvertAll<SelectListItem>((State item) => ViewHelpers.GetSelectedListItem(item, selected));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<City> cities, int selected)
		{
			List<SelectListItem> selectListItems = cities.ConvertAll<SelectListItem>((City item) => ViewHelpers.GetSelectedListItem(item, selected));
			return selectListItems;
		}

		public static List<SelectListItem> ToSelectedListItemList(this List<Publication> publications, int selected)
		{
			List<SelectListItem> selectListItems = publications.ConvertAll<SelectListItem>((Publication item) => ViewHelpers.GetSelectedListItem(item, selected));
			return selectListItems;
		}
	}
}