using Microsoft.AspNetCore.Mvc;
using TaskManager.DataAccess;
using TaskManager.Models;
using TaskManager.ViewModels;

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
      return View();
    }

    [HttpGet]
    public IActionResult GetTasks()
    {
      var tasks = _context.UserTasks.ToList();
      return Json(tasks);
    }

    [HttpGet]
    public IActionResult Create()
    {
      return View();
    }

    [HttpPost]
    public IActionResult Create(TaskFormViewModel viewModel)
    {
      if (ModelState.IsValid)
      {
        _context.UserTasks.Add(viewModel.Task);
        _context.SaveChanges();

        // Return a JSON response with a success status and the new task
        return Json(new { success = true, task = viewModel.Task });
      }

      // If model state is not valid, return a JSON response with an error status
      var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
      return Json(new { success = false, errors });
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
    public async Task<IActionResult> Edit(UserTask task)
    {
      if (ModelState.IsValid)
      {
        var existingTask = await _context.UserTasks.FindAsync(task.Id);

        if (existingTask == null)
        {
          return NotFound();
        }

        existingTask.UpdateTask(task.Title, task.Description, task.DueDate);
        _context.Update(existingTask);

        await _context.SaveChangesAsync();

        return Json(new { success = true });
      }

      return Json(new { 
        success = false, 
        errors = ModelState.Values
          .SelectMany(v => v.Errors)
          .Select(e => e.ErrorMessage) 
      });

    }

    [HttpGet]
    public async Task<IActionResult> EditModal(int id)
    {
        var task = await _context.UserTasks.FindAsync(id);

        if (task == null)
        {
          return NotFound();
        }

        ViewBag.Action = "Edit";
        ViewBag.ButtonText = "Save changes";
        ViewBag.FormId = "editForm";
        return PartialView("_EditTaskModal", task);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
      var task = await _context.UserTasks
        .FindAsync(id);

      if (task == null)
      {
        return NotFound();
      }

      return View(task);
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
      var task = await _context.UserTasks.FindAsync(id);
      if (task == null)
      {
        return Json(new { success = false, errors = new[] { "Task not found" } });
      }

      _context.UserTasks.Remove(task);

      await _context.SaveChangesAsync();

      return Json(new { success = true });
    }

    [HttpPost]
    public async Task<IActionResult> MarkAsComplete(int id)
    {
      var task = await _context.UserTasks.FindAsync(id);

      if (task == null)
      {
        return NotFound();
      }

      task.MarkAsCompleted();

      _context.UserTasks.Update(task);

      await _context.SaveChangesAsync();

      return Json(new { success = true });
    }
  }
}