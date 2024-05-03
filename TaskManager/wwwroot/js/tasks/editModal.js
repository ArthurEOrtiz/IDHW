$(document).ready(function () {
  $('#editModalContainer').load('/modals/tasks/editModal.cshtml', function () {
    var editModalElement = document.getElementById('editModal');
    var editFormElement = document.getElementById('editForm');

    if (editModalElement && editFormElement) {
      var editModal = new bootstrap.Modal(editModalElement);

      window.openEditModal = function (id, title, description, dueDate) {
        document.getElementById('editId').value = id;
        document.getElementById('editTitle').value = title;
        document.getElementById('editDescription').value = description;
        document.getElementById('editDueDate').value = dueDate;
        editModal.show();
      }

      editFormElement.addEventListener('submit', function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        console.log(this.action);
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
    }
  });
});