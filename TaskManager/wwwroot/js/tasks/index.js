// Table
const renderTable = (() => {
  document.addEventListener('DOMContentLoaded', () => {
    fetch(window.getTasksUrl)
      .then(response => response.json())
      .then(data => {
        // Hide the loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';

        // Populate the table with the data
        const tbody = document.querySelector('#tasksTable tbody');
        tbody.innerHTML = '';
        data.forEach(task => {
          tbody.appendChild(createTaskRow(task));
        });

        // Show the table
        document.getElementById('tasksTable').style.display = 'table';
      });
  });
})();

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
    window.location.href = window.detailsUrl + '/' + task.id;
  });

  row.appendChild(createTableCell(task.title));
  row.appendChild(createTableCell(task.isCompleted));
  row.appendChild(createTableCell(new Date(task.dueDate).toLocaleDateString()));

  const tdButtons = document.createElement('td');
  tdButtons.addEventListener('click', event => {
    event.stopPropagation();
  });

  tdButtons.appendChild(createButton('btn btn-success me-2', 'Complete', () => openCompleteConfirmationModal(task.id)));
  tdButtons.appendChild(createButton('btn btn-primary me-2', 'Edit', () => openEditModal(task.id)));
  tdButtons.appendChild(createButton('btn btn-danger', 'Delete', () => openDeleteConfirmationModal(task.id)));

  row.appendChild(tdButtons);

  return row;
}

// Modals
(() => {
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

  openEditModal = (id) => {
    fetch('/Tasks/EditModal/' + id)
      .then(response => response.text())
      .then(data => {
        document.getElementById('editModalContainer').innerHTML = data;
        const editModalElement = document.getElementById('editModal');
        const editFormElement = document.getElementById('editForm');
        const editModal = new bootstrap.Modal(editModalElement);

        editFormElement.addEventListener('submit', function (e) {
          e.preventDefault();
          const formData = new FormData(this);
          fetch('Tasks/Edit', {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                editModal.hide();
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

        editModal.show();
      });
  }

  openConfirmationModal = (id, titleText, messageText, url) => {
      const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      const confirmationButton = document.getElementById('confirmationModalConfirmButton');
      const title = document.getElementById('confirmationModalTitle');
      const message = document.getElementById('confirmationModalMessage');

      title.innerText = titleText;
      message.innerText = messageText;

      confirmationButton.onclick = () => {
        fetch(url + id, {
          method: 'POST'
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              confirmationModal.hide();
              location.reload();
            } else {
              alert('Error: ' + data.errors.join('\n'));
            }
          })
          .catch(error => {
            console.error(error.message);
            alert('Network error: ' + error);
          });
      }

      confirmationModal.show();
    }

  openDeleteConfirmationModal = (id) => {
      openConfirmationModal(id, 'Delete Task', 'Are you sure you want to delete this task?', 'Tasks/Delete/');
    }

  openCompleteConfirmationModal = (id) => {
      openConfirmationModal(id, 'Complete Task', 'Are you sure you want to complete this task?', 'Tasks/MarkAsComplete/');
  }

})();

