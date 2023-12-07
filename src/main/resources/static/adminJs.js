(function showAllUsers() {
    let tBody = document.getElementById("tBody");
    tBody.innerHTML = "";
    fetch('/api/getAllUsers')
        .then(response => response.json())
        .then(users => {
            users.forEach(function (user) {
                var row = tBody.insertRow();
                row.setAttribute("id", user.id);
                var cell0 = row.insertCell();
                cell0.innerHTML = user.id;
                var cell1 = row.insertCell();
                cell1.innerHTML = user.firstname;
                var cell2 = row.insertCell();
                cell2.innerHTML = user.surname;
                var cell3 = row.insertCell();
                cell3.innerHTML = user.age;
                var cell4 = row.insertCell();
                cell4.innerHTML = user.email;
                var cell5 = row.insertCell();
                cell5.innerHTML = editRoles(user);

                var cell6 = row.insertCell();
                cell6.innerHTML =
                    '<button type="button" onclick="getModalEdit(' + user.id + ')" class="btn btn-primary btn-sm">Edit</button>';

                var cell7 = row.insertCell();
                cell7.innerHTML =
                    '<button type="button" onclick="getModalDelete(' + user.id + ')" class="btn btn-danger btn-sm">Delete</button>';
            })
        });
})();

function deleteUser(id) {
    fetch('/api/delete/' + id, {
        method: 'DELETE',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => {
            $('#' + id).remove();
        });
}

function getModalDelete(id) {

    fetch('/api/getUserById/' + id)
        .then(response => response.json())
        .then(user => {

            let adminSelect = "";
            let userSelect = "";

            for (let i = 0; i < user.role.length; i++) {
                if (user.role[i].name == "ROLE_ADMIN") {
                    adminSelect = "selected";
                }
                if (user.role[i].name == "ROLE_USER") {
                    userSelect = "selected";
                }
            }

            let modal = document.getElementById('modalWindow');

            modal.innerHTML =
                '<div id="modalDelete" ' +
                '     class="modal fade" tabindex="-1" role="dialog"' +
                '     aria-labelledby="TitleModalLabel" aria-hidden="true" ' +
                '     data-backdrop="static" data-keyboard="false">' +
                '    <div class="modal-dialog modal-dialog-scrollable">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <h5 class="modal-title" id="TitleModalLabel">Delete user</h5>' +
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                </button>' +
                '            </div>' +
                '            <div class="modal-body bg-white">' +
                '                <form id="formEditUser" style="width: 200px;" ' +
                '                       class="form-signin mx-auto font-weight-bold text-center">' +
                '                    <p>' +
                '                        <label>ID</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               name="id" value="' + user.id + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>First name</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               value="' + user.firstname + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Surname</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               value="' + user.surname + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Age</label>' +
                '                        <input class="form-control form-control-sm" type="number"' +
                '                               value="' + user.age + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Email</label>' +
                '                        <input class="form-control form-control-sm" type="email"' +
                '                               value="' + user.email + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Role</label>' +
                '                        <select class="form-control form-control-sm" multiple size="2" readonly>' +
                '                            <option value="ROLE_ADMIN"' + adminSelect + ' >ADMIN</option>' +
                '                            <option value="ROLE_USER"' + userSelect + '>USER</option>' +
                '                        </select>' +
                '                    </p>' +
                '                </form>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-secondary"' +
                '                        data-dismiss="modal">Close</button>' +
                '                <button class="btn btn-danger" data-dismiss="modal"' +
                '                        onclick="deleteUser(' + user.id + ')">Delete</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            $("#modalDelete").modal();

        });
}

async function editUser() {
    const form = window.formEditUser;
    const RolesElement = form.editRoles;
    const roles = Array.from(RolesElement.options)
        .filter(option => option.selected)
        .map(option => ({
            id: option.getAttribute('data-id'),
            name: option.value
        }));

    const updateUser = {
        id: form.editID.value,
        firstname: form.editFirstName.value,
        surname: form.editSurname.value,
        age: form.editAge.value,
        email: form.editEmail.value,
        password: form.editPassword.value,
        role: roles
    };

    const response = await fetch('/api/update', {
        method: 'PUT',
        body: JSON.stringify(updateUser),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });

    if (response.ok) {
        const user = await response.json();
        $('#' + user.id).replaceWith(createTableRow(user, roles.map(role => role.name.replace('ROLE_', '')).join(" ")));
    } else {
        console.error(`Failed to update user: ${response.statusText}`);
    }
}

function handleValidationErrors(errors) {
    resetErrorMessages();

    for (const error of errors) {
        const fieldName = error.field;
        const errorMessage = error.defaultMessage;

        const inputElement = document.getElementById(`edit${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
        const errorDiv = document.createElement("div");
        errorDiv.className = "invalid-feedback";
        errorDiv.innerText = errorMessage;

        inputElement.classList.add("is-invalid");
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    }
}

function resetErrorMessages() {
    const errorDivs = document.querySelectorAll(".invalid-feedback");
    errorDivs.forEach(errorDiv => errorDiv.remove());

    const inputElements = document.querySelectorAll(".form-control");
    inputElements.forEach(inputElement => inputElement.classList.remove("is-invalid"));
}

function getModalEdit(id) {

    fetch('/api/getUserById/' + id)
        .then(response => response.json())
        .then(user => {

            let adminSelect = "";
            let userSelect = "";

            for (let i = 0; i < user.role.length; i++) {
                if (user.role[i].name == "ROLE_ADMIN") {
                    adminSelect = "selected";
                }
                if (user.role[i].name == "ROLE_USER") {
                    userSelect = "selected";
                }
            }

            let modal = document.getElementById('modalWindow');

            modal.innerHTML =
                '<div id="modalEdit"' +
                '     class="modal fade" tabindex="-1" role="dialog"' +
                '     aria-labelledby="TitleModalLabel" aria-hidden="true"' +
                '     data-backdrop="static" data-keyboard="false">' +
                '    <div class="modal-dialog modal-dialog-scrollable">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <h5 class="modal-title" id="TitleModalLabel">Edit user</h5>' +
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                </button>' +
                '            </div>' +
                '            <div class="modal-body bg-white">' +
                '                <form id="formEditUser" style="width: 200px;"' +
                '                       class="form-signin mx-auto font-weight-bold text-center">' +
                '                    <p>' +
                '                        <label>ID</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               id="editID" name="id" value="' + user.id + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>First name</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               id="editFirstName" value="' + user.firstname + '"' +
                '                               placeholder="First name" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Surname</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               id="editSurname" value="' + user.surname + '" ' +
                '                               placeholder="Surname" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Age</label>' +
                '                        <input class="form-control form-control-sm" type="number"' +
                '                               id="editAge" value="' + user.age + '" ' +
                '                               placeholder="Age" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Email</label>' +
                '                        <input class="form-control form-control-sm" type="email"' +
                '                               id="editEmail" value="' + user.email + '"' +
                '                               placeholder="Email" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Password</label>' +
                '                        <input class="form-control form-control-sm" type="password"' +
                '                               id="editPassword" placeholder="Password">' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Role</label>' +
                '                        <select id="editRoles" name="roles" multiple size="2" required ' +
                '                               class="form-control form-control-sm">' +
                '                            <option value="ROLE_ADMIN" data-id="1" ' + adminSelect + '>ADMIN</option>' +
                '                            <option value="ROLE_USER" data-id="2" ' + userSelect + '>USER</option>' +
                '                        </select>' +
                '                    </p>' +
                '                </form>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-secondary"' +
                '                        data-dismiss="modal">Close</button>' +
                '                <button class="btn btn-primary" data-dismiss="modal"' +
                '                        onclick="editUser()">Edit</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            $("#modalEdit").modal();

        });
}

async function newUser() {
    const form = window.formNewUser;
    const newRolesElement = form.newRoles;
    const roles = Array.from(newRolesElement.options)
        .filter(option => option.selected)
        .map(option => ({
            id: option.getAttribute('data-id'),
            name: option.value
        }));

    const newUser = {
        firstname: form.newFirstName.value,
        surname: form.newSurname.value,
        age: form.newAge.value,
        email: form.newEmail.value,
        password: form.newPassword.value,
        role: roles
    };

    const response = await fetch('/api/create', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    });

    if (response.ok) {
        const user = await response.json();
        $('#tBody tr:last').after(createTableRow(user, roles.map(role => role.name.replace('ROLE_', '')).join(" ")));
        resetForm(form);
        $('#NewUserCreated').modal();
    } else {
        const errors = await response.json();
        handleValidationErrors(errors);
    }
}

function handleValidationErrors(errors) {
    resetErrorMessages();

    for (const error of errors) {
        const fieldName = error.field;
        const errorMessage = error.defaultMessage;

        const inputElement = document.getElementById(`new${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
        const errorDiv = document.createElement("div");
        errorDiv.className = "invalid-feedback";
        errorDiv.innerText = errorMessage;

        inputElement.classList.add("is-invalid");
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    }
}

function resetErrorMessages() {
    const errorDivs = document.querySelectorAll(".invalid-feedback");
    errorDivs.forEach(errorDiv => errorDiv.remove());

    const inputElements = document.querySelectorAll(".form-control");
    inputElements.forEach(inputElement => inputElement.classList.remove("is-invalid"));
}

function createTableRow(user, roles) {
    return '<tr id=' + user.id + '>' +
        '<td>' + user.id + '</td>' +
        '<td>' + user.firstname + '</td>' +
        '<td>' + user.surname + '</td>' +
        '<td>' + user.age + '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + roles + '</td>' +
        '<td> <button type="button" onclick="getModalEdit(' + user.id + ')" class="btn btn-primary btn-sm">Edit</button> </td>' +
        '<td> <button type="button" onclick="getModalDelete(' + user.id + ')" class="btn btn-danger btn-sm">Delete</button> </td>' +
        '</tr>';
}

function resetForm(form) {
    form.newFirstName.value = "";
    form.newSurname.value = "";
    form.newAge.value = "";
    form.newEmail.value = "";
    form.newPassword.value = "";
    form.newRoles.value = "";
}