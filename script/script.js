/*Service Worker register */
if('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('Service Worker registrado con éxito:', registration);
        }).catch(function(error) {
        console.log('Error al registrar el Service Worker:', error);
        });
    });
};

/*Class to create DataBase */
class DataBase { 
    constructor() {
        this.data = null;
    }
    add(taskData) {
        if(this.data == null) {
            this.data = [];
            this.data.push(taskData);
            this.save(this.data);
        }
        else {
            this.load();
            this.data.push(taskData);
            this.save(this.data);
        };
    };
    show() {
        taskArea.innerHTML = '';
        if(this.data == null || this.data.length == 0) {}
        else {
            /*This is important, we're gona save here some html containers */
            let checkboxStatus;
            taskArea.style.display = "flex";
            for(let i=0; i<this.data.length; i++) {
                if(this.data[i] !== null) {
                    /*Here we change the status of the checkbox and the paragraph of the task info in case the task is finished or not */
                    if(this.data[i].status == "Finalizada") {
                        checkboxStatus = 
                        `   
                            <p class="allTaskParagraph" id="taskParagraph${i}" style="text-decoration: line-through;">${this.data[i].info}</p>
                            <div id="taskParagraphCheckbox">
                                <p id="pTaskStatus${this.data[i].id}" style="color: #248eff;">${this.data[i].status}</p>
                                <input id="inputCheckbox${i}" type="checkbox" checked="checked" onclick="taskStatusChange(${this.data[i].id})">
                            </div>
                        `
                    }
                    else {
                        checkboxStatus = 
                        `
                            <p class="allTaskParagraph" id="taskParagraph${i}" style="text-decoration: none;">${this.data[i].info}</p>
                            <div id="taskParagraphCheckbox">
                                <p id="pTaskStatus${this.data[i].id}" style="color: #ff7b00;">${this.data[i].status}</p>
                                <input id="inputCheckbox${i}" type="checkbox" onclick="taskStatusChange(${this.data[i].id})">
                            </div>
                        `
                    }
                    taskArea.innerHTML += `
                        <div id="taskContainer">
                            <div id="taskParagraphsAndInput">
                                ${checkboxStatus}
                            </div>
                            <div id="taskBtns">
                                <button onclick="editTask(${this.data[i].id})">Editar</button>
                                <button onclick="deleteTask(${this.data[i].id})">Borrar</button>
                            </div>
                        </div>
                    `;
                }
            };
        }
    };
    save(data) {
        localStorage.setItem('dataBase', JSON.stringify(data));
    }
    load() {
        return this.data = JSON.parse(localStorage.getItem('dataBase'));
    };
};

/* Class to create Tasks */
class Task {
    constructor(info) {
        this.info = info;
        this.status = null;
    };
};

/*Data base */
let dataBase = new DataBase(); 

/*General Variables */
let alertMessage = document.getElementById("alertMessage");
let inputInfo = document.getElementById("mainInput");
let btnAdd = document.getElementById("btnAdd");
let taskArea = document.getElementById("taskArea");
let dialogEdit = document.getElementById("dialogEdit");

/*Hide sections display */
alertMessage.style.display = "none";
taskArea.style.display = "none";

/*Focus the main input */
inputInfo.focus();

/*Create an ID for the task */
let createId = (task) => {
    if(dataBase.data == null) {
        task.id = 0;
    }
    else {
        task.id = dataBase.data.length;
    }
    return task;
};

/*A new task */
let newTask = (inputInfo) => {
    inputInfo = inputInfo.value;
    let task = new Task(inputInfo);
    task.status = "Sin finalizar";
    createId(task);
    return task;
};

/*Show a message to the user about a situation*/
let alertMessageFunction = (messageId) => {
    let message;
    if(messageId == 0) {
        message = `<p id="alertMessage">No se ingresó suficiente información</p>`;
    };
    alertMessage.style.display = "flex";
    alertMessage.innerHTML = message;
    setTimeout(() => {
        alertMessage.style.display = "none";
        alertMessage.innerHTML = "";
    }, 2500);
};

/*Cheks if there are spaces without sense in the task info */
let checkingTask = (task) => {
    if(task.info.length == 0) {
        task.info = false;
        alertMessageFunction(0);
    }
    else if(task.info.length == 1 && task.info[0] == " "){
        task.info = false;
        alertMessageFunction(0);
    }
    else {
        let testing;
        for(let i=0; i<=task.info.length-1; i++) {
            if(task.info[i] == " ") {
                testing = false;
                if(task.info[i-1] !== " ") {
                    testing = true;
                };
            }
            else {
                testing = true;
            };
        };
        if(testing == false) {
            task.info = false;
            alertMessageFunction(0);
        }
        else {
            for(let i=0; i<=task.info.length-1; i++) {
                if((task.info[i-1] == " " && task.info[i+1] == " ") && task.info[i] == " ") {
                    task.info[i] = "";
                };
            };
        };
    };
};

/*Add a new task to the data base and clean the input */
btnAdd.addEventListener('click', () => {
    let task = newTask(inputInfo);
    checkingTask(task);
    if(task.info !== false) {
        dataBase.add(task);
        dataBase.show();
    };
    inputInfo.value = "";
    inputInfo.focus();
});

/*Change the task status by pressing the checkbox */
let taskStatusChange = (id) => {  
    let taskParagraph = document.getElementById(`taskParagraph${id}`);
    let inputCheckbox = document.getElementById(`inputCheckbox${id}`)
    // let actualTask = dataBase.data[id];
    if(dataBase.data[id].status == "Sin finalizar") {
        dataBase.data[id].status = "Finalizada";
        dataBase.save(dataBase.data);
    }
    else {
        dataBase.data[id].status = "Sin finalizar";
        dataBase.save(dataBase.data);
    }
    dataBase.show();
};

/*Edit tasks */
let editTask = (id) => {
    let actualTask = dataBase.data[id];
    dialogEdit.innerHTML = `
        <dialog id="modalWindowEdit">
            <div id="modalWindowEditMainDiv">
                <input value="${actualTask.info}" id="newTaskInfo${id}">
                <div id="modalWindowEditBtn">
                    <button id="editTaskBtn${id}">Guardar</button>
                    <button id="closeModal" onclick="closeModalWindow(dialogEdit)">Cancelar</button>
                </div>
            </div>
        </dialog>
    `;
    let newTaskInfo = document.getElementById(`newTaskInfo${id}`);
    newTaskInfo.focus();
    let editTaskBtn = document.getElementById(`editTaskBtn${id}`);
    editTaskBtn.addEventListener('click', () => {
        dataBase.data[id].info = newTaskInfo.value;
        closeModalWindow(dialogEdit);
        dataBase.save(dataBase.data);
        dataBase.show();
    });
};

/*Delete tasks */
let deleteTask = (id) => {
    let dialogDelete = document.getElementById("dialogDelete");
    dialogDelete.innerHTML = `
        <dialog id="modalWindowDelete">
            <div id="modalWindowDeleteMainDiv">
                <p>¿Estás seguro que deseas eliminar ésta tarea?</p>
                <div id="modalWindowDeleteBtn">
                    <button id="deleteTask${id}">Eliminar</button>
                    <button id="closeModal${id}" onclick="closeModalWindow(dialogDelete)">Cancelar</button>
                </div>
            </div>
        </dialog>
    `;
    let deleteTaskPress = document.getElementById(`deleteTask${id}`);
    let closeModal = document.getElementById(`closeModal${id}`);
    /*This is to focus the button of cancel*/
    closeModal.focus();
    deleteTaskPress.addEventListener('click', () => {
        dataBase.data[id] = null;
        closeModalWindow(dialogDelete);
        dataBase.save(dataBase.data);
        dataBase.show();
    });
};

/*Close any modalWindow(dialog) */
let closeModalWindow = (modalId) => {
    modalId.innerHTML = "";
};

/*Loads the localStorage */
dataBase.load();
dataBase.show();
// localStorage.clear();