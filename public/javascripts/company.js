$(document).ready(function() {
    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true
    });
    $("#filter-date").click(function() {
        location.href = `http://localhost:3000/companies/?from=${$("#from").val()}&to=${$("#to").val()}`
    })
    pagInation()
    $("#addBtn").click(createUser)
    $(".profile").click(function() {
        readUser($(this).attr("companyId"));
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
    for (let index = 0; index < companiesLength / 6; index++) {
        url.searchParams.set('pageno', index + 1)
        if (page == index + 1)
            $(".pagination").append(`<li class="page-item disabled">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
        else
            $(".pagination").append(`<li class="page-item">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
    }
    url.searchParams.set('pageno', parseInt(page) + 1)
    if (page < Math.ceil(companiesLength / 6))
        $(".pagination").append(`<li class="page-item" id="next">
        <a class="page-link" href=${url.href} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`)
}

function createUser() {
    $(".modal").css("display", "block")
    $('.modal-header h2').html("Create")

    $(".modal-body").append(`<span id="name"><label>name: </label><input></input></span>
    <span id="registration_number"><label>registration number: </label><input></input></span>
    <span id="state"><label>state: </label><input></input></span>
    <span id="city"><label>city: </label><input></input></span>
    <span id="CreationDate"><label>Creation date: </label><input type="date" value="yyyy-mm-dd"></span>
    <span id="phone_number"><label>phone number: </label><input></input></span>`)

    $('.modal-footer').html(`<button class="btn createBtn">Create</button>`)
    $(".createBtn").click(function() {
        newObject = {};
        $(".modal-body input").each(function() { newObject[$(this).parent().attr("id")] = $(this).val() });
        $.ajax({
            type: "PUT",
            url: "http://localhost:3000/companies",
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
        url: `http://localhost:3000/companies/${id}`,
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
                             <p>name: ${object.name}</p>
                             <p>registration number: ${object.registration_number}</p>
                             <p>state: ${object.state}</p>
                             <p>city: ${object.city}</p>
                             <p>Creation date: ${object.CreationDate}</p>
                             <p>phone number: ${object.phone_number}</p>`)

    $('.modal-footer').html(`<button class="btn updateBtn">Update</button>
                             <button class="btn removeBtn">Delete</button>`)
    $(".removeBtn").click(function() { deleteUser(id) })
    $(".updateBtn").click(function() { updateUser(object) })
}

function updateUser(object) {
    $('.modal-header h2').html("Update")
    $(".modal-body").html("")

    $(".modal-body").append(`<span id="name"><label>name: </label><input value=${object.name}></input></span>
    <span id="registration_number"><label>registration number: </label><input value=${object.registration_number}></input></span>
    <span id="state"><label>state: </label><input value=${object.state}></input></span>
    <span id="city"><label>city: </label><input value=${object.city}></input></span>
    <span id="CreationDate"><label>Creation date: </label><input type="date" value=${object.CreationDate}></span>
    <span id="phone_number"><label>phone number: </label><input value=${object.phone_number}></input></span>`)

    $('.modal-footer').html(`<button class="btn saveBtn">Save</button>`)
    $(".saveBtn").click(function() {
        updatedObject = {};
        $(".modal-body input").each(function() { updatedObject[$(this).parent().attr("id")] = $(this).val() });
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/companies/${object._id}`,
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
        url: `http://localhost:3000/companies/${id}`,
        async: false,
        success: function(result) {
            alert("deleted successfully")
            location.href = "http://localhost:3000/companies/"
        },
        error: function(error) {
            alert(JSON.parse(error.responseText).msg);
            alert(JSON.parse(error.responseText).err);
        }
    });
}