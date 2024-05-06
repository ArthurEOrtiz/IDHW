window.validateTitle = (e) => {
  const title = e.value;
  const taskFormTitleValidator = e.nextElementSibling;

  taskFormTitleValidator.textContent = title.length < 3
    ? 'Title must be at least 3 characters long.'
    : title.length > 50
      ? 'Title must be less than 50 characters long.'
      : '';
};

window.updateCounter = (e) => {
  const counter = e.nextElementSibling;
  counter.innerText = `${e.value.length}/500`;
};


window.validateDueDate = (e) => {
  const date = new Date(e.value);
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskFormDateValidator = e.nextElementSibling;

  taskFormDateValidator.textContent = date < today
    ? 'Due date must be today or in the future.'
    : '';
};




