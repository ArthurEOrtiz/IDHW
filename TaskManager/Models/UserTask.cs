
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.Models
{
	public class UserTask
	{
		// Properties
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public string? Description { get; set; }
		public DateTime DueDate { get; set; }
		public bool IsCompleted { get; set; } = false;
		public DateTime CreatedAt { get; } = DateTime.Now;
		public DateTime UpdatedAt { get; set; } = DateTime.Now;

		// Constructor
		public UserTask(DateTime dueDate)
		{
			DueDate = dueDate;
		}

		// Methods
		public void MarkAsCompleted()
		{
			IsCompleted = true;
			UpdatedAt = DateTime.Now;
		}

		public void UpdateTask(string title, string? description, DateTime dueDate)
		{
			Title = title;
			Description = description;
			DueDate = dueDate;
			UpdatedAt = DateTime.Now;
		}



	}
}
