using System.ComponentModel.DataAnnotations;

namespace TaskManager.Attributes
{
  [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
  public class FutureDateAttribute : ValidationAttribute
  {
    
    public override bool IsValid(object? value)
    {
      if (value is DateTime)
      {
        DateTime compareDate = (DateTime)value;
        if (compareDate.Date > DateTime.Now.Date)
        {
          return true;
        }
      }

      return false;
    }
  }
}
