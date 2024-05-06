(() => { 
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
            });
        });

        editModal.show();
      });
  }
})();

