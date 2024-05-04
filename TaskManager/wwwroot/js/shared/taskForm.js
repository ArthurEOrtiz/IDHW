const limit = 500
const textArea = document.getElementById('Description');
const counter = document.getElementById('descriptionCounter');

// Set the initial count
counter.innerText = `${textArea.value.length}/${limit}`;

// Update the count when the user types
textArea.addEventListener('input', () => {
  counter.innerText = `${textArea.value.length}/${limit}`;
});