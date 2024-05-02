using Microsoft.AspNetCore.Mvc;

namespace TaskManager.Controllers
{
	public class HomeController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
