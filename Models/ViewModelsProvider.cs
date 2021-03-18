using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web.Mvc;
using UserManagementSystem.Business.Components;
using UserManagementSystem.Configuration;
using UserManagementSystem.Web.Helpers;
using UserManagementSystem.Shared.Entities;
using UserManagementSystem.Shared.Entities.Enum;

namespace UserManagementSystem.Web.Models
{
    public static class ViewModelsProvider
    {
        public static CreateAdminViewModel GetCreateAdminViewModel()
        {
            return new CreateAdminViewModel()
            {
                IsActive = true
            };
        }

        public static CreateUserViewModel GetCreateUserViewModel()
        {
            CreateUserViewModel createUserViewModel = new CreateUserViewModel();
            List<SelectListItem> emailTypes = ViewModelsProvider.GetEmailTypes();
            List<SelectListItem> phoneTypes = ViewModelsProvider.GetPhoneTypes();
            createUserViewModel.CommunicationSettings = new CommunicationSettingsViewModel();
            createUserViewModel.Roles = CustomConverter.FromUmsClientRolesListToSelectedList();
            createUserViewModel.Publications = (
                from s in PublicationBc.Instance.GetBrands(true)
                select new PublicationViewModel()
                {
                    Brand = s,
                    Publications = new List<SelectListItem>()
                }).ToList<PublicationViewModel>();
            List<EmailViewModel> emailViewModels = new List<EmailViewModel>()
            {
                new EmailViewModel()
                {
                    EmailTypes = emailTypes
                }
            };
            createUserViewModel.Emails = emailViewModels;
            List<PhoneViewModel> phoneViewModels = new List<PhoneViewModel>()
            {
                new PhoneViewModel()
                {
                    PhoneTypes = phoneTypes
                }
            };
            createUserViewModel.Phones = phoneViewModels;
            AddressViewModel addressViewModel = new AddressViewModel()
            {
                Countries = LocationBc.Instance.GetCountries().ToSelectedListItemList(),
                States = new List<SelectListItem>(),
                Cities = new List<SelectListItem>()
            };
            createUserViewModel.Addresses = new List<AddressViewModel>()
            {
                addressViewModel
            };
            createUserViewModel.IsActive = true;
            return createUserViewModel;
        }

        public static EditAdminViewModel GetEditAdminViewModel(Account account)
        {
            EditAdminViewModel editAdminViewModel = new EditAdminViewModel(account.Id, account.PrimaryEmail, account.FirstName, account.LastName, account.IsActive);
            return editAdminViewModel;
        }

        public static EditUserViewModel GetEditUserViewModel(Account account)
        {
            List<PhoneViewModel> list;
            List<EmailViewModel> emailViewModels;
            FullAddress fullAddress = account.FullAddresses.FirstOrDefault<FullAddress>();
            List<SelectListItem> selectListItems = new List<SelectListItem>();
            List<SelectListItem> selectedListItemList = new List<SelectListItem>();
            List<SelectListItem> selectListItems1 = new List<SelectListItem>();
            if (fullAddress != null)
            {
                selectListItems = LocationBc.Instance.GetCountries().ToSelectedListItemList(fullAddress.Country.Id);
                selectedListItemList = LocationBc.Instance.GetStates(fullAddress.Country.Id).ToSelectedListItemList(fullAddress.State.Id);
                selectListItems1 = LocationBc.Instance.GetCities(fullAddress.State.Id).ToSelectedListItemList(fullAddress.City.Id);
            }
            List<SelectListItem> selectedList = CustomConverter.FromUmsClientRolesListToSelectedList();
            List<PhoneType> phoneTypes = AccountBc.Instance.GetPhoneTypes();
            if (account.Phones.Count == 0)
            {
                List<PhoneViewModel> phoneViewModels = new List<PhoneViewModel>();
                PhoneViewModel phoneViewModel = new PhoneViewModel()
                {
                    PhoneTypes = CustomConverter.FromPhoneTypesListToSelectedList(phoneTypes, 0)
                };
                phoneViewModels.Add(phoneViewModel);
                list = phoneViewModels;
            }
            else
            {
                list = (
                    from phone in account.Phones
                    select new PhoneViewModel(phone.Id, phone.Type.Id, phone.Number, CustomConverter.FromPhoneTypesListToSelectedList(phoneTypes, phone.Type.Id), phone.CreateUserId)).ToList<PhoneViewModel>();
            }
            List<PhoneViewModel> phoneViewModels1 = list;
            List<EmailType> emailTypes = AccountBc.Instance.GetEmailTypes();
            if (account.Emails.Count == 0)
            {
                List<EmailViewModel> emailViewModels1 = new List<EmailViewModel>();
                EmailViewModel emailViewModel = new EmailViewModel()
                {
                    EmailTypes = CustomConverter.FromEmailTypesListToSelectedList(emailTypes, 0)
                };
                emailViewModels1.Add(emailViewModel);
                emailViewModels = emailViewModels1;
            }
            else
            {
                emailViewModels = (
                    from email in account.Emails
                    select new EmailViewModel(email.Id, email.Type.Id, email.Value, CustomConverter.FromEmailTypesListToSelectedList(emailTypes, email.Type.Id), email.CreateUserId)).ToList<EmailViewModel>();
            }
            List<EmailViewModel> emailViewModels2 = emailViewModels;
            List<PublicationViewModel> publicationViewModels = ViewModelsProvider.GetPublicationViewModels(account.Publications);
            EditUserViewModel editUserViewModel = new EditUserViewModel(account, selectListItems, selectedListItemList, selectListItems1, selectedList, phoneViewModels1, emailViewModels2, publicationViewModels);
            return editUserViewModel;
        }

        public static EditUserViewModel GetEditUserViewModel(EditUserViewModel editUserViewModel)
        {
            editUserViewModel.FullAddress.Countries = LocationBc.Instance.GetCountries().ToSelectedListItemList(editUserViewModel.FullAddress.SelectedCountryID);
            editUserViewModel.FullAddress.States = LocationBc.Instance.GetStates(editUserViewModel.FullAddress.SelectedCountryID).ToSelectedListItemList(editUserViewModel.FullAddress.SelectedStateID);
            editUserViewModel.FullAddress.Cities = LocationBc.Instance.GetCities(editUserViewModel.FullAddress.SelectedStateID).ToSelectedListItemList(editUserViewModel.FullAddress.SelectedCityID);
            List<PhoneType> phoneTypes = AccountBc.Instance.GetPhoneTypes();
            List<EmailType> emailTypes = AccountBc.Instance.GetEmailTypes();
            editUserViewModel.Phones.RemoveAll((PhoneViewModel e) => string.IsNullOrEmpty(e.Number));
            foreach (PhoneViewModel phone in editUserViewModel.Phones)
            {
                phone.PhoneTypes = CustomConverter.FromPhoneTypesListToSelectedList(phoneTypes, -1);
            }
            if (editUserViewModel.Phones.Count == 0)
            {
                List<PhoneViewModel> phoneViewModels = new List<PhoneViewModel>();
                PhoneViewModel phoneViewModel = new PhoneViewModel()
                {
                    PhoneTypes = CustomConverter.FromPhoneTypesListToSelectedList(phoneTypes, 0)
                };
                phoneViewModels.Add(phoneViewModel);
                editUserViewModel.Phones = phoneViewModels;
            }
            editUserViewModel.Emails.RemoveAll((EmailViewModel e) => string.IsNullOrEmpty(e.Value));
            if (editUserViewModel.Emails.Count == 0)
            {
                List<EmailViewModel> emailViewModels = new List<EmailViewModel>();
                EmailViewModel emailViewModel = new EmailViewModel()
                {
                    EmailTypes = CustomConverter.FromEmailTypesListToSelectedList(emailTypes, 0)
                };
                emailViewModels.Add(emailViewModel);
                editUserViewModel.Emails = emailViewModels;
            }
            foreach (EmailViewModel email in editUserViewModel.Emails)
            {
                email.EmailTypes = CustomConverter.FromEmailTypesListToSelectedList(emailTypes, -1);
            }
            foreach (PublicationViewModel selectedList in
                from p in editUserViewModel.Publications
                where p.BrandSelected
                select p)
            {
                List<Publication> publications = PublicationBc.Instance.GetPublications(selectedList.Brand);
                IEnumerable<SelectListItem> selectListItems =
                    from p in selectedList.Publications
                    where p.Selected
                    select p;
                List<Publication> list = (
                    from p in publications
                    where selectListItems.FirstOrDefault<SelectListItem>((SelectListItem s) => s.Value == p.Id.ToString()) != null
                    select p).ToList<Publication>();
                selectedList.Publications = CustomConverter.FromPublicationsListToSelectedList(publications, list);
            }
            editUserViewModel.Roles = CustomConverter.FromUmsClientRolesListToSelectedList();
            return editUserViewModel;
        }

        private static List<SelectListItem> GetEmailTypes()
        {
            List<SelectListItem> list = (
                from e in AccountBc.Instance.GetEmailTypes()
                select new SelectListItem()
                {
                    Value = e.Id.ToString(),
                    Text = e.Description
                }).ToList<SelectListItem>();
            return list;
        }

        private static List<SelectListItem> GetPhoneTypes()
        {
            List<SelectListItem> list = (
                from p in AccountBc.Instance.GetPhoneTypes()
                select new SelectListItem()
                {
                    Value = p.Id.ToString(),
                    Text = p.Description
                }).ToList<SelectListItem>();
            return list;
        }

        private static List<PublicationViewModel> GetPublicationViewModels(List<Publication> accountPublications)
        {
            List<BrandType> brands = PublicationBc.Instance.GetBrands(true);
            List<BrandType> list = (
                from publ in accountPublications
                select publ.Brand into b
                group b by b.Id into b
                select b.First<BrandType>()).ToList<BrandType>();
            List<PublicationViewModel> publicationViewModels = new List<PublicationViewModel>();
            foreach (BrandType brand in brands)
            {
                List<Publication> publications = PublicationBc.Instance.GetPublications(brand);
                List<Publication> list1 = (
                    from publ in accountPublications
                    where publ.Brand.Id == brand.Id
                    select publ).ToList<Publication>();
                List<SelectListItem> selectedList = CustomConverter.FromPublicationsListToSelectedList(publications, list1);
                publicationViewModels.Add(new PublicationViewModel(selectedList, brand, list.Any<BrandType>((BrandType x) => x.Id == brand.Id)));
            }
            return publicationViewModels;
        }

        private static List<UserListViewModel> GetUserListViewModel(IEnumerable<Account> accounts)
        {
            List<UserListViewModel> userListViewModels = new List<UserListViewModel>();
            foreach (Account account in accounts)
            {
                UserListViewModel userListViewModel = new UserListViewModel()
                {
                    Id = account.Id,
                    Username = string.Concat(account.FirstName, " ", account.LastName),
                    Email = account.PrimaryEmail,
                    Leads = account.CommunicationSettings.HasLeads,
                    Notifications = account.CommunicationSettings.HasNotifications
                };
                userListViewModels.Add(userListViewModel);
            }
            return userListViewModels;
        }

        private static UserPaginationViewModel GetUserPaginationViewModel(int pageIndex, int pageSize, int totalCount)
        {
            int i;
            int defaultUserListAvailablePageIndexesCount = ConfigurationManager.DefaultUserListAvailablePageIndexesCount;
            int num = (int)Math.Floor(defaultUserListAvailablePageIndexesCount - 1 / new decimal(2));
            int num1 = (int)Math.Ceiling(defaultUserListAvailablePageIndexesCount - 1 / new decimal(2));
            int num2 = (int)Math.Ceiling((decimal)totalCount / pageSize);
            if (defaultUserListAvailablePageIndexesCount > num2)
            {
                defaultUserListAvailablePageIndexesCount = num2;
            }
            List<int> nums = new List<int>();
            if (pageIndex - num <= 0)
            {
                for (i = 1; i <= defaultUserListAvailablePageIndexesCount; i++)
                {
                    nums.Add(i);
                }
            }
            else if (num2 - pageIndex >= num)
            {
                for (i = pageIndex - num; i <= pageIndex + num1; i++)
                {
                    nums.Add(i);
                }
            }
            else
            {
                for (i = num2 - defaultUserListAvailablePageIndexesCount + 1; i <= num2; i++)
                {
                    nums.Add(i);
                }
            }
            List<int> rangeList = CustomConverter.GetRangeList(1, num2);
            List<int> rangeList1 = CustomConverter.GetRangeList(1, ConfigurationManager.MaxUserListPageSize);
            return new UserPaginationViewModel(pageSize, pageIndex, totalCount, nums, rangeList, rangeList1);
        }

        //public static UsersPageResultViewModel GetUsersPageResultViewModel(int? pageSize, int? pageIndex, string subnameFilter, string subEmailFilter, SortOrder? nameOrder, SortOrder? emailOrder, CheckFilter? leadFilter, CheckFilter? notificationFilter)
        //{
        //    int num;
        //    if (!pageSize.HasValue)
        //    {
        //        pageSize = new int?(ConfigurationManager.DefaultUserListPageSize);
        //    }
        //    if (!pageIndex.HasValue)
        //    {
        //        pageIndex = new int?(ConfigurationManager.DefaultUserListPageIndex);
        //    }
        //    if (!nameOrder.HasValue)
        //    {
        //        nameOrder = new SortOrder?(SortOrder.Unsorted);
        //    }
        //    if (!emailOrder.HasValue)
        //    {
        //        emailOrder = new SortOrder?(SortOrder.Unsorted);
        //    }
        //    if (!leadFilter.HasValue)
        //    {
        //        leadFilter = new CheckFilter?(CheckFilter.Any);
        //    }
        //    if (!notificationFilter.HasValue)
        //    {
        //        notificationFilter = new CheckFilter?(CheckFilter.Any);
        //    }
        //    List<Account> list = AccountBc.Instance.GetUsers(pageSize.Value, pageIndex.Value, subnameFilter, subEmailFilter, nameOrder.Value, emailOrder.Value, leadFilter.Value, notificationFilter.Value, out num).ToList<Account>();
        //    List<UserListViewModel> userListViewModel = ViewModelsProvider.GetUserListViewModel(list);
        //    UserGridOptionsViewModel userGridOptionsViewModel = new UserGridOptionsViewModel(subnameFilter, subEmailFilter, nameOrder.Value, emailOrder.Value, leadFilter.Value, notificationFilter.Value);
        //    UserPaginationViewModel userPaginationViewModel = ViewModelsProvider.GetUserPaginationViewModel(pageIndex.Value, pageSize.Value, num);
        //    return new UsersPageResultViewModel(userListViewModel, userGridOptionsViewModel, userPaginationViewModel);
        //}

        public static CreateUserViewModel UpdateCreateUserViewModel(CreateUserViewModel model)
        {
            List<SelectListItem> emailTypes = ViewModelsProvider.GetEmailTypes();
            List<SelectListItem> phoneTypes = ViewModelsProvider.GetPhoneTypes();
            if (model.Emails != null)
            {
                model.Emails.RemoveAll((EmailViewModel e) => string.IsNullOrEmpty(e.Value));
                foreach (EmailViewModel email in model.Emails)
                {
                    email.EmailTypes = emailTypes;
                }
                if (model.Emails.Count == 0)
                {
                    List<EmailViewModel> emailViewModels = new List<EmailViewModel>()
                    {
                        new EmailViewModel()
                        {
                            EmailTypes = emailTypes
                        }
                    };
                    model.Emails = emailViewModels;
                }
            }
            else
            {
                List<EmailViewModel> emailViewModels1 = new List<EmailViewModel>()
                {
                    new EmailViewModel()
                    {
                        EmailTypes = emailTypes
                    }
                };
                model.Emails = emailViewModels1;
            }
            if (model.Phones != null)
            {
                model.Phones.RemoveAll((PhoneViewModel e) => string.IsNullOrEmpty(e.Number));
                foreach (PhoneViewModel phone in model.Phones)
                {
                    phone.PhoneTypes = phoneTypes;
                }
                if (model.Phones.Count == 0)
                {
                    List<PhoneViewModel> phoneViewModels = new List<PhoneViewModel>()
                    {
                        new PhoneViewModel()
                        {
                            PhoneTypes = phoneTypes
                        }
                    };
                    model.Phones = phoneViewModels;
                }
            }
            else
            {
                List<PhoneViewModel> phoneViewModels1 = new List<PhoneViewModel>()
                {
                    new PhoneViewModel()
                    {
                        PhoneTypes = phoneTypes
                    }
                };
                model.Phones = phoneViewModels1;
            }
            List<SelectListItem> selectedListItemList = LocationBc.Instance.GetCountries().ToSelectedListItemList();
            Dictionary<int, List<SelectListItem>> nums = new Dictionary<int, List<SelectListItem>>();
            Dictionary<int, List<SelectListItem>> nums1 = new Dictionary<int, List<SelectListItem>>();
            foreach (AddressViewModel address in model.Addresses)
            {
                if (!nums.ContainsKey(address.SelectedStateID))
                {
                    nums.Add(address.SelectedStateID, LocationBc.Instance.GetStates(address.SelectedCountryID).ToSelectedListItemList());
                }
                if (!nums1.ContainsKey(address.SelectedCityID))
                {
                    nums1.Add(address.SelectedCityID, LocationBc.Instance.GetCities(address.SelectedStateID).ToSelectedListItemList());
                }
            }
            foreach (AddressViewModel addressViewModel in model.Addresses)
            {
                addressViewModel.Countries = selectedListItemList;
                AddressViewModel value = addressViewModel;
                KeyValuePair<int, List<SelectListItem>> keyValuePair = nums.First<KeyValuePair<int, List<SelectListItem>>>((KeyValuePair<int, List<SelectListItem>> st) => st.Key == addressViewModel.SelectedStateID);
                value.States = keyValuePair.Value;
                AddressViewModel value1 = addressViewModel;
                keyValuePair = nums1.First<KeyValuePair<int, List<SelectListItem>>>((KeyValuePair<int, List<SelectListItem>> c) => c.Key == addressViewModel.SelectedCityID);
                value1.Cities = keyValuePair.Value;
            }
            foreach (PublicationViewModel selectedList in
                from p in model.Publications
                where p.BrandSelected
                select p)
            {
                List<Publication> publications = PublicationBc.Instance.GetPublications(selectedList.Brand);
                IEnumerable<SelectListItem> selectListItems =
                    from p in selectedList.Publications
                    where p.Selected
                    select p;
                List<Publication> list = (
                    from p in publications
                    where selectListItems.FirstOrDefault<SelectListItem>((SelectListItem s) => s.Value == p.Id.ToString()) != null
                    select p).ToList<Publication>();
                selectedList.Publications = CustomConverter.FromPublicationsListToSelectedList(publications, list);
            }
            model.Roles = CustomConverter.FromUmsClientRolesListToSelectedList();
            return model;
        }
    }
}