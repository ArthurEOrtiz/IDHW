(() => {
  const limit = 500;
  const textAreas = document.querySelectorAll('.description');
  const counters = document.querySelectorAll('.descriptionCounter');

  textAreas.forEach((textArea, index) => {
    // Set the initial count
    counters[index].innerText = `${textArea.value.length}/${limit}`;

    // Update the count when the user types
    textArea.addEventListener('input', () => {
      counters[index].innerText = `${textArea.value.length}/${limit}`;
    });
  });


})();