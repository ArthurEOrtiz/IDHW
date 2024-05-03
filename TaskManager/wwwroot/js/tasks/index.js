$(function () {

  window.openEditModal = function (id) {
    $.get('/Tasks/EditModal/' + id, function (data) {
      $('#editModalContainer').html(data);
      var editModalElement = document.getElementById('editModal');
      var editFormElement = document.getElementById('editForm');
      var editModal = new bootstrap.Modal(editModalElement);

      editFormElement.addEventListener('submit', function (e) {
        e.preventDefault();
        var formData = new FormData(this);
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

  window.openConfirmationModal = function (id, titleText, messageText, url) {
    var confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    var confirmationButton = document.getElementById('confirmationModalConfirmButton');
    var title = document.getElementById('confirmationModalTitle');
    var message = document.getElementById('confirmationModalMessage');

    title.innerText = titleText;
    message.innerText = messageText;

    confirmationButton.onclick = function () {
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

  window.openDeleteConfirmationModal = function (id) {
    openConfirmationModal(id, 'Delete Task', 'Are you sure you want to delete this task?', 'Tasks/Delete/');
  }

  window.openCompleteConfirmationModal = function (id) {
    openConfirmationModal(id, 'Complete Task', 'Are you sure you want to complete this task?', 'Tasks/MarkAsComplete/');
  }

});