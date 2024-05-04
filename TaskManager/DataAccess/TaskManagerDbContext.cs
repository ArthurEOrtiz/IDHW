using Microsoft.EntityFrameworkCore;
using TaskManager.Models;

namespace TaskManager.DataAccess
{
	public class TaskManagerDbContext : DbContext
	{
		public TaskManagerDbContext(DbContextOptions<TaskManagerDbContext> options) : base(options)
		{
		}

		public DbSet<UserTask> UserTasks { get; set; }
	}
}
