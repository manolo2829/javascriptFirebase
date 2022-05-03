const firebaseConfig = {
    apiKey: "AIzaSyCU1wf-NP0dY9B3pmMUpd0jXqCWMF6JEwk",
    authDomain: "crud-javascript-b892b.firebaseapp.com",
    projectId: "crud-javascript-b892b",
    storageBucket: "crud-javascript-b892b.appspot.com",
    messagingSenderId: "280899990868",
    appId: "1:280899990868:web:74bdb6485d30b2551b44c1"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const saveTask = (title,description) => {
    db.collection('tasks').doc().set({
        title,
        description
    })
}  
const taskForm = document.querySelector('#task-form')
const tasksContainer = document.getElementById('tasks-container')

let editStatus = false;
let id = '';

const getTasks = () => db.collection('tasks').get();
const onGetTask = (callback) => db.collection('tasks').onSnapshot(callback)

const deleteTask = id => db.collection('tasks').doc(id).delete()
const getTask = (id) => db.collection('tasks').doc(id).get();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask)

window.addEventListener('DOMContentLoaded', async(e) => {
    onGetTask((querySnapshot) => {
        tasksContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            console.log(doc.data())
    
            const task = doc.data()
            task.id = doc.id;
    
            tasksContainer.innerHTML += `
                <div class='card card-body mt-2 border-primary'>
                    <h3 class='h5'>${task.title}</h3>
                    <p>${task.description}</h3>
                    <div>
                        <button class='btn btn-primary btn-delete' data-id='${task.id}'>Delete</button>
                        <button class='btn btn-secondary btn-edit' data-id='${task.id}'>Edit</button>
                    </div>
                </div>
            `

            const btnDelete = document.querySelectorAll('.btn-delete')
            const btnEdit = document.querySelectorAll('.btn-edit')

            btnDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await deleteTask(e.target.dataset.id)
                })
            })

            btnEdit.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data()

                    editStatus = true
                    id = doc.id;

                    taskForm['task-title'].value  = task.title;
                    taskForm['task-description'].value = task.description
                    taskForm['btn-task-form'].innerHTML = 'Update'
                
                })
            })

        });
    })
})

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    // DENTRO DEL TASKFORM QUIERO CAPTURAR EL TASKTITLE Y DESCRIPTION
    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    if(!editStatus){
        // LUEGO PASAMOS LOS INPUT PEOR SOLO EL VALOR
        await saveTask(title.value,description.value)
    }else{
        await updateTask(id , {
            title: title.value,
            description: description.value
        })
    }

    await getTasks();
    // RESETEAR EL FORMULARIO
    taskForm.reset();
    title.focus()
})

