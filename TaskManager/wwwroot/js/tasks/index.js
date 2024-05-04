
//(() => {
//  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//  const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
//    return new bootstrap.Tooltip(tooltipTriggerEl)
//  })
//})();


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

