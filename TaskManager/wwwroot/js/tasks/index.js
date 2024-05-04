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
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.setAttribute('data-bs-toggle', 'tooltip');
            row.setAttribute('title', task.description);
            row.addEventListener('click', () => {
              window.location.href = windows.detailUrl + '/' + task.id;
            });

            const tdTitle = document.createElement('td');
            tdTitle.textContent = task.title;
            row.appendChild(tdTitle);

            const tdIsCompleted = document.createElement('td');
            tdIsCompleted.textContent = task.isCompleted;
            row.appendChild(tdIsCompleted);

            const tdDueDate = document.createElement('td');
            tdDueDate.textContent = new Date(task.dueDate).toLocaleDateString();
            row.appendChild(tdDueDate);

            const tdButtons = document.createElement('td');
            tdButtons.addEventListener('click', event => {
              event.stopPropagation();
            });

            const btnComplete = document.createElement('button');
            btnComplete.className = 'btn btn-success';
            btnComplete.textContent = 'Complete';
            btnComplete.addEventListener('click', e => {
              e.stopPropagation();
              openCompleteConfirmationModal(task.id);
            });
            tdButtons.appendChild(btnComplete);

            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn btn-primary';
            btnEdit.textContent = 'Edit';
            btnEdit.addEventListener('click', e => {
              e.stopPropagation();
              openEditModal(task.id);
            });
            tdButtons.appendChild(btnEdit);

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-danger';
            btnDelete.textContent = 'Delete';
            btnDelete.addEventListener('click', e => {
              e.stopPropagation();
              openDeleteConfirmationModal(task.id);
            });
            tdButtons.appendChild(btnDelete);

            row.appendChild(tdButtons);
            tbody.appendChild(row);
          });

          // Initialize tooltips for the new rows
          const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
          const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

          // Show the table
          document.getElementById('tasksTable').style.display = 'table';
        });
    });
  })();

openEditModal = (id) => {
    $.get('/Tasks/EditModal/' + id, (data) => {
      $('#editModalContainer').html(data);
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

