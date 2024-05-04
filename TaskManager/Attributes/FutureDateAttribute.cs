using System.ComponentModel.DataAnnotations;

namespace TaskManager.Attributes
{
  [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
  public class FutureDateAttribute : ValidationAttribute
  {
    public override bool IsValid(object? value)
    {
      if (value is DateTime compareDate && compareDate.Date >= DateTime.Today)
      {
        return true;
      }

      return false;
    }
  }
}
