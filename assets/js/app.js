

const table = document.getElementById('table');
const form = document.querySelector('.user-form');
const inputName = document.getElementById('inputName');
const inputUsername = document.getElementById('inputUsername');
const inputEmail = document.getElementById('inputEmail');
const btnSubmit = document.getElementById('submit');
const btnUpdate = document.getElementById('update');

const user_url = 'https://jsonplaceholder.typicode.com/users';
let user_array = [];


// functions
const makeNetworkCall = (method, api_url, body) => {
    return new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, api_url);
        xhr.onload = function(){
            if(xhr.status == 200 || xhr.status == 201){
                res(xhr.response);
            }else{
                rej("API call was unsuccessful.");
            }
        }
        xhr.send(body);
    })
}

const templating = (arr) => {
    let final = '';
    arr.forEach((ele, i) => {
        final+= `
        <tr>
            <td>${i + 1}</td>
            <td>${ele.name}</td>
            <td>${ele.username}</td>
            <td>${ele.email}</td>
            <td><i class="fa-regular fa-pen-to-square" data-id="${ele.id}" onclick= 'onEditEventHandler(this)'></i></td>
            <td><i class="fa-solid fa-trash" data-id="${ele.id}" onclick= 'onDeleteEventHandler(this)'></i></td>
        </tr>
        `
    });
    table.innerHTML = final;
}

const onSubmitEventHandler = (e) => {
    e.preventDefault();
    // console.log("submitted");
    let obj = {};
    obj.name = inputName.value;
    obj.username = inputUsername.value;
    obj.email = inputEmail.value;
    console.log(obj);

    user_array.push(obj);
    templating(user_array);
    makeNetworkCall("POST", user_url, JSON.stringify(obj))
        .then(res => console.log(res))
        .catch(err => console.log(err));
    e.target.reset();
}

const onEditEventHandler = (e) => {
    // console.log(e);
    let edit_id = e.dataset.id;
    localStorage.setItem('edit_id', edit_id);
    let edit_url = `${user_url}/${edit_id}`;
    let edit_obj = {};
    makeNetworkCall("GET", edit_url)
        .then(res => {
            // console.log(res);
            edit_obj = JSON.parse(res)
            // console.log(edit_obj);
            inputName.value = edit_obj.name;
            inputUsername.value = edit_obj.username;
            inputEmail.value = edit_obj.email;
        })
        .catch(err => console.log(err));
    
    btnSubmit.classList.add('d-none');
    btnUpdate.classList.remove('d-none');
}

const onDeleteEventHandler = (e) => {
    // console.log(e);
    let delete_id = e.dataset.id;
    console.log(delete_id);
    let delete_url = `${user_url}/${delete_id}`;
    user_array = user_array.filter(obj => obj.id != delete_id);
    templating(user_array);

    // for deleting in database
    makeNetworkCall('DELETE', delete_url);
    
}

const onUpdateEventHandler = (e) => {
    // console.log('clicked');
    let update_id = localStorage.getItem('edit_id');
    // console.log(update_id);
    let update_url = `${user_url}/${update_id}`;
    let update_obj = {};
    user_array.forEach(ele => {
        if(ele.id == update_id){
            ele.name = inputName.value;
            ele.username = inputUsername.value;
            ele.email = inputEmail.value;
        }
    })
    templating(user_array);
    // for updating the database
    update_obj.name = inputName.value;
    update_obj.username = inputUsername.value;
    update_obj.email = inputEmail.value;
    makeNetworkCall('PATCH', update_url, JSON.stringify(update_obj)); 

    btnSubmit.classList.remove('d-none');
    btnUpdate.classList.add('d-none');
    form.reset(); 
}

// network call

makeNetworkCall("GET", user_url)
    .then(res => {
        user_array = JSON.parse(res);
        // console.log(user_array);
        templating(user_array);
        form.reset();
    })
    .catch(err => console.log(err));


// events

form.addEventListener('submit', onSubmitEventHandler);
btnUpdate.addEventListener('click', onUpdateEventHandler)