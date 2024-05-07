// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Global javascript.
(() => {
  const openConfirmationModal = (id, titleText, messageText, url) => {
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
  };

  // Organize methods into an object to avoid conflicts.
  window.modals = {
    openEditModal: (id) => {
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
            fetch('/Tasks/Edit', {
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
                console.error(error);
                alert('Network error: ' + error);
              });
          });

          editModal.show();
      });
    },

    openDeleteConfirmationModal: (id) => {
      openConfirmationModal(id, 'Delete Task', 'Are you sure you want to delete this task?', '/Tasks/Delete/');
    },

    openCompleteConfirmationModal: (id) => {
      openConfirmationModal(id, 'Complete Task', 'Are you sure you want to complete this task?', '/Tasks/MarkAsComplete/');
    }
  }
})();
