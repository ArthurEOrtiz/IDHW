using Microsoft.AspNetCore.Mvc;
using TaskManager.DataAccess;
using TaskManager.Models;

namespace TaskManager.Controllers
{
	public class TasksController : Controller
	{
		private readonly TaskManagerDbContext _context;

		public TasksController(TaskManagerDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult Index()
		{
			var tasks = _context.UserTasks.ToList();
			return View(tasks);
		}

		[HttpGet]
		public IActionResult Create()
		{
			return View();
		}

		[HttpPost]
		public IActionResult Create(UserTask task)
		{
			if (ModelState.IsValid)
			{
				_context.UserTasks.Add(task);
				_context.SaveChanges();

				// Save the task to the database
				return RedirectToAction("Index");
			}
			return View(task);
		}


	}
}
