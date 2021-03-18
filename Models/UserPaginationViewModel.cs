using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace UserManagementSystem.Web.Models
{
	public class UserPaginationViewModel
	{
		public List<int> AvailableIndexes
		{
			get;
			set;
		}

		public int PageIndex
		{
			get;
			set;
		}

		public List<int> PageIndexList
		{
			get;
			set;
		}

		public int PageSize
		{
			get;
			set;
		}

		public List<int> PageSizeList
		{
			get;
			set;
		}

		public int TotalCount
		{
			get;
			set;
		}

		public UserPaginationViewModel()
		{
			this.AvailableIndexes = new List<int>();
			this.PageIndexList = new List<int>();
			this.PageSizeList = new List<int>();
		}

		public UserPaginationViewModel(int pageSize, int pageIndex, int totalCount, List<int> availableIndeces, List<int> pageIndexList, List<int> pageSizeList)
		{
			this.PageSize = pageSize;
			this.PageIndex = pageIndex;
			this.TotalCount = totalCount;
			this.AvailableIndexes = availableIndeces;
			this.PageIndexList = pageIndexList;
			this.PageSizeList = pageSizeList;
		}
	}
}