using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Attributes
{
  [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
  public class FutureDateAttribute : ValidationAttribute, IClientModelValidator
  {
    public override bool IsValid(object? value)
    {
      if (value is DateTime compareDate && compareDate.Date >= DateTime.Today)
      {
        return true;
      }

      return false;
    }

    public void AddValidation(ClientModelValidationContext context)
    {
      ArgumentNullException.ThrowIfNull(context);

      MergeAttribute(context.Attributes, "data-val", "true");
      MergeAttribute(context.Attributes, "data-val-futuredate", ErrorMessage ?? "Invalid date.");
    }

    private bool MergeAttribute(IDictionary<string, string> attributes, string key, string value)
    {
      if (attributes.ContainsKey(key))
      {
        return false;
      }

      attributes.Add(key, value);
      return true;
    }
  }
}
