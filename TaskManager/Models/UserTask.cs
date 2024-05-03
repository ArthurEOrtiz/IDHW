﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.Attributes;

namespace TaskManager.Models
{
	public class UserTask()
	{
		// Properties
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }

		[Required]
		[MinLength(3, ErrorMessage = "Title must be at least 3 characters long.")]
		public string Title { get; set; } = string.Empty;
		public string? Description { get; set; }

		[Required]
		[FutureDate(ErrorMessage = "The Due Date must be either today or a future date.")]
		public DateTime DueDate { get; set; }
		public bool IsCompleted { get; set; } = false;
		public DateTime CreatedAt { get; } = DateTime.Now;
		public DateTime UpdatedAt { get; set; } = DateTime.Now;

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
