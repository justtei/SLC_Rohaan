using System;

namespace UserManagementSystem.Web.Models
{
	public enum ModelErrorKey
	{
		UnsuccesessfulPrimaryEmail = 1,
		UnsuccessfulLogin = 2,
		UnknownErrorDuringUserSaving = 3,
		UnsuccessfulForgot = 4,
		UnsuccessfulPasswordChange = 5,
		NoBrandSelected = 6,
		NoPublicationSelected = 7
	}
}