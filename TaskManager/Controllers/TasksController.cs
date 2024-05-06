using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.DataAccess;
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
    public async Task<IActionResult> GetTasks()
    {
      var tasks = await _context.UserTasks.ToListAsync();
      return Json(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TaskFormViewModel viewModel)
    {
      if (ModelState.IsValid)
      {
        await _context.UserTasks.AddAsync(viewModel.Task);
        await _context.SaveChangesAsync();

        return Json(new { success = true });
      }

      return Json(new
      {
        success = false,
        errors = ModelState.Values
          .SelectMany(v => v.Errors)
          .Select(e => e.ErrorMessage)
      });
    }

    [HttpPost]
    public async Task<IActionResult> Edit(TaskFormViewModel viewModel)
    {
      if (ModelState.IsValid)
      {
        var existingTask = await _context.UserTasks.FindAsync(viewModel.Task.Id);

        if (existingTask == null)
        {
          return NotFound();
        }

        existingTask.UpdateTask(
          viewModel.Task.Title, 
          viewModel.Task.Description, 
          viewModel.Task.DueDate
          );

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

      var viewModel = new TaskFormViewModel()
      {
        Task = task,
        Action = "Edit",
        ButtonText = "Save Changes",
        FormId = "editForm"
      };

      return PartialView("_EditTaskModal", viewModel);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
      var task = await _context.UserTasks.FindAsync(id);

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