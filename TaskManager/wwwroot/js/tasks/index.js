(() => {
// Render Table onLoad.
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/Tasks/GetTasks/')
      .then(response => response.json())
      .then(data => {
        // Hide the loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';

        // Populate the table
        const tbody = document.querySelector('#tasksTable tbody');
        data.forEach(task => {
          tbody.appendChild(createTaskRow(task));
        });

        // Show the table
        document.getElementById('tasksTable').style.display = 'table';
      });
  });


  const createButton = (className, text, clickHandler) => {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    button.setAttribute('aria-label', text);
    button.addEventListener('click', e => {
      e.stopPropagation();
      clickHandler();
    });
    return button;
  }

  const createTableCell = (text) => {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
  }

  const createTaskRow = (task) => {
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';
    row.setAttribute('data-bs-toggle', 'tooltip');
    row.setAttribute('title', task.description);
    row.addEventListener('click', () => {
      window.location.href = `/Tasks/Details/${task.id}`;
    });

    row.appendChild(createTableCell(task.title));
    row.appendChild(createTableCell(task.isCompleted));
    row.appendChild(createTableCell(new Date(task.dueDate).toLocaleDateString()));

    const tdButtons = document.createElement('td');
    tdButtons.addEventListener('click', event => {
      event.stopPropagation();
    });

    tdButtons.appendChild(createButton('btn btn-success me-2', 'Complete', () => window.modals.openCompleteConfirmationModal(task.id)));
    tdButtons.appendChild(createButton('btn btn-primary me-2', 'Edit', () => window.modals.openEditModal(task.id)));
    tdButtons.appendChild(createButton('btn btn-danger', 'Delete', () => window.modals.openDeleteConfirmationModal(task.id)));

    row.appendChild(tdButtons);

    return row;
   }

  // Create Task Modal
  // So far this only happens in index.cshtml, this could move if things change.
  // Edit and Confirmation modals are in site.js as they will be needed else where.
  const createTaskModal = new bootstrap.Modal(document.getElementById('createTaskModal'));
  const createForm = document.getElementById('createForm');

  createForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(createForm);

    fetch('/Tasks/Create', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          createTaskModal.hide();
          location.reload();
        } else {
          alert('Error: ' + data.errors.join('\n'));
        }
      })
      .catch(error => {
        console.error(error.message);
        alert('Network error: ' + error);
      });
  });
})();

