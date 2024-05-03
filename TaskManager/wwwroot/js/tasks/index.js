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

  window.openDeleteModal = function (id) {
    var confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    var confirmationButton = document.getElementById('confirmationModalConfirmButton');
    var title = document.getElementById('confirmationModalTitle');
    var message = document.getElementById('confirmationModalMessage');

    title.innerText = 'Delete Task';
    message.innerText = 'Are you sure you want to delete this task?';

    confirmationButton.onclick = function () {
      fetch('Tasks/Delete/' + id, {
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
        });
    }

    confirmationModal.show();
  }

});