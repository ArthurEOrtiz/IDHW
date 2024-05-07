window.updateCounter = (e) => {
  const counter = e.nextElementSibling;
  counter.innerText = `${e.value.length}/500`;
};


// This applies the custom model attribute to the jquery validation.
$(function () {
  $.validator.addMethod("futuredate", function (value, element) {
    var today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to 00:00:00
    var inputDate = new Date(value);

    return this.optional(element) || inputDate >= today;
  }, "");

  $.validator.unobtrusive.adapters.addBool("futuredate");
});

// This ensures the all forms get parsed for validation
$(function () {
  $("form").each(function () {
    $(this).data("validator", null);
    $.validator.unobtrusive.parse(this);
  });
});

// This is for reparsing the form to apply the validation, if opened in a modal.
$(document).on('shown.bs.modal', '.modal', function () {
  $("form").each(function () {
    $(this).removeData("validator");
    $(this).removeData("unobtrusiveValidation");
    $.validator.unobtrusive.parse(this);
  });
});



