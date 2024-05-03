$(document).ready(function () {

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

});