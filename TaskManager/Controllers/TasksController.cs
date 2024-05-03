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
        return RedirectToAction("Index");
      }
      return View(task);
    }

    [HttpGet]
    public IActionResult Edit(int id)
    {
      var task = _context.UserTasks.Find(id);
      if (task == null)
      {
        return NotFound();
      }
      return View(task);
    }

    [HttpPost]
    public IActionResult Edit(UserTask task)
    {
      if (ModelState.IsValid)
      {
        var existingTask = _context.UserTasks.Find(task.Id);
        if (existingTask == null)
        {
          return NotFound();
        }
        existingTask.UpdateTask(task.Title, task.Description, task.DueDate);
        _context.SaveChanges();
        return Json(new { success = true });
      }
      return Json(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
    }

    [HttpPost]
    public IActionResult Delete(int id)
    {
      var task = _context.UserTasks.Find(id);
      if (task == null)
      {
        return NotFound();
      }
      _context.UserTasks.Remove(task);
      _context.SaveChanges();
      return RedirectToAction("Index");
    }

    [HttpPost]
    public IActionResult MarkAsComplete(int id)
    {
      var task = _context.UserTasks.Find(id);
      if (task == null)
      {
        return NotFound();
      }
      task.MarkAsCompleted();
      _context.SaveChanges();
      return RedirectToAction("Index");
    }
  }
}