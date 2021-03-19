$(document).ready(function() {
    pagInation()
    $("#addBtn").click(createUser)
    $(".btn-primary").click(function() {
        readUser($(this).attr("employeeId"));
    })
    $(".close").click(function() {
        $("#myModal").css("display", "none");
        $('.modal-header h2').html("");
        $('.modal-body').html("");
        $('.modal-footer').html("");
    });
})

function pagInation() {
    const url = new URL(window.location.href);
    let page = url.searchParams.get("pageno")
    if (!page)
        page = 1
    url.searchParams.set('pageno', parseInt(page) - 1)
    if (page && page != 1)
        $(".pagination").append(`<li class="page-item" id="pre">
        <a class="page-link" href=${url.href} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span></a></li>`)
    for (let index = 0; index < employeesLength / 6; index++) {
        url.searchParams.set('pageno', index + 1)
        if (page == index + 1)
            $(".pagination").append(`<li class="page-item disabled">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
        else
            $(".pagination").append(`<li class="page-item">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)

    }
    url.searchParams.set('pageno', parseInt(page) + 1)
    if (page < Math.ceil(employeesLength / 6))
        $(".pagination").append(`<li class="page-item" id="next">
        <a class="page-link" href=${url.href} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`)
}

function createUser() {
    $(".modal").css("display", "block")
    $('.modal-header h2').html("Create")

    $(".modal-body").append(`<span id="first_name"><label>first name: </label><input></input></span>
    <span id="last_name"><label>last name: </label><input></input></span>
    <span id="code_number"><label>code number: </label><input></input></span>
    <span id="gender"><label>gender: </label><select><option value="male">Male</option><option value="female">Female</option></select></span>
    <span id="isManager"><label>role: </label><select><option value=false>Employee</option><option value=true>Manager</option></select></span>
    <span id="birth_date"><label>birth date: </label><input type="date" value="yyyy-mm-dd"></span>`)

    $('.modal-footer').html(`<button class="btn createBtn">Create</button>`)
    $(".createBtn").click(function() {
        const companyId = $("#companyName").attr("companyId")
        newObject = { company: companyId };
        $(".modal-body input").each(function() { newObject[$(this).parent().attr("id")] = $(this).val() });
        $(".modal-body select").each(function() { newObject[$(this).parent().attr("id")] = $(this).val() });
        $.ajax({
            type: "PUT",
            url: "http://localhost:3000/employees",
            async: false,
            data: newObject,
            success: function() {
                alert("created successfully")
                location.reload();
            },
            error: function(error) {
                alert(JSON.parse(error.responseText).msg);
                alert(JSON.parse(error.responseText).err);
            }
        });
    })
}

function readUser(id) {
    let object;
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/employees/${id}`,
        async: false,
        success: function(result) {
            object = result;
        },
        error: function(error) {
            alert(JSON.parse(error.responseText).msg);
            alert(JSON.parse(error.responseText).err);
        }
    });
    $(".modal").css("display", "block")

    $('.modal-header h2').html("Read")
    $(".modal-body").append(`<p>id: ${object._id}</p>
                             <p>first name: ${object.first_name}</p>
                             <p>last name: ${object.last_name}</p>
                             <p>code number: ${object.code_number}</p>
                             <p>gender: ${object.gender}</p>`)
    if (object.isManager)
        $(".modal-body").append(`<p>role: Manager</p>`)
    else
        $(".modal-body").append(`<p>role: Employee</p>`)
    $(".modal-body").append(`<p>birth date: ${object.birth_date}</p>
                            <p>age: ${object.age}</p>`)

    $('.modal-footer').html(`<button class="btn updateBtn">Update</button>
                             <button class="btn removeBtn">Delete</button>`)
    $(".removeBtn").click(function() { deleteUser(id) })
    $(".updateBtn").click(function() { updateUser(object) })
}

function updateUser(object) {
    $('.modal-header h2').html("Update")
    $(".modal-body").html("")

    $(".modal-body").append(`<span id="first_name"><label>first name: </label><input value=${object.first_name}></input></span>
    <span id="last_name"><label>last name: </label><input value=${object.last_name}></input></span>
    <span id="code_number"><label>code number: </label><input value=${object.code_number}></input></span>`)
    if (object.gender == 'male')
        $(".modal-body").append(`<span id="gender"><label>gender: </label><select><option value="male">Male</option><option value="female">Female</option></select></span>`)
    else
        $(".modal-body").append(`<span id="gender"><label>gender: </label><select><option value="female">Female</option><option value="male">Male</option></select></span>`)
    if (object.isManager)
        $(".modal-body").append(`<span id="isManager"><label>role: </label><select><option value=true>Manager</option><option value=false>Employee</option></select></span>`)
    else
        $(".modal-body").append(`<span id="isManager"><label>role: </label><select><option value=false>Employee</option><option value=true>Manager</option></select></span>`)
    $(".modal-body").append(`<span id="birth_date"><label>birth date: </label><input type="date" value=${object.birth_date}></span>`)

    $('.modal-footer').html(`<button class="btn saveBtn">Save</button>`)
    $(".saveBtn").click(function() {
        updatedObject = { _id: object._id };
        $(".modal-body input").each(function() { updatedObject[$(this).parent().attr("id")] = $(this).val() });
        $(".modal-body select").each(function() { updatedObject[$(this).parent().attr("id")] = $(this).val() });
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/employees/${object._id}`,
            async: false,
            data: updatedObject,
            success: function(result) {
                alert("updated successfully")
                location.reload();
            },
            error: function(error) {
                alert(JSON.parse(error.responseText).msg);
                alert(JSON.parse(error.responseText).err);
            }
        });
    })
}

function deleteUser(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/employees/${id}`,
        async: false,
        success: function(result) {
            alert("deleted successfully")
            location.href = `http://localhost:3000/companies/company/${result.employee.company}`
        },
        error: function(error) {
            alert(JSON.parse(error.responseText).msg);
            alert(JSON.parse(error.responseText).err);
        }
    });
}