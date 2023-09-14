const taskWrapper = document.querySelector('.task__list');
const btnSubmit = document.querySelector('.form__btn');
const formInput = document.querySelector('.form__descr');
const btnDone = document.querySelector('.radio__done');
const btnProgress = document.querySelector('.radio__progress');
const labelDone = document.querySelector('.action__done');
const labelProgress = document.querySelector('.action__progress');
let countDone = 0;
let countProgress = 0;

//БД задач
let taskListDB = [
    {
        text:"Помыть посуду",
        status: 'progress'
    }, 
    {
        text: "Погладить кота",
        status: 'progress'
    }, 
    {
        text:"Поиграть с собакой",
        status: 'complete'
    }
];


//создание всего списка

let createTaskList = function () {
    taskWrapper.innerHTML = "";

    //счетчики задач
    countDone = 0;
    countProgress = 0;
    
    // формирование массива задач, запись в localStorage
    if(!localStorage.getItem("taskList")) {
        localStorage.setItem("taskList", JSON.stringify(taskListDB));
    }

    let newTaskDB = JSON.parse(localStorage.getItem("taskList"));
    newTaskDB.forEach((item) => {
        createTask(item.text, item.status);
    })

    labelDone.textContent = `Todo Done: ${countDone}`;
    labelProgress.textContent = `Todo On Progress: ${countProgress}`;

    //удаление задач
    document.querySelectorAll('.trash-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            newTaskDB.splice(i, 1);
            localStorage.setItem("taskList",JSON.stringify(newTaskDB));
            let taskListDOM = document.querySelectorAll('.task__item');
            let currentTask = taskListDOM[i];
            currentTask.style.backgroundColor = "#85858533";
            currentTask.style.transform = "translateY(50px)";
            currentTask.style.opacity = "0";
            setTimeout(function() {
                createTaskList();
            },500);
            
        });
    });

    let changeStatus = function (task, newStatus) {
        newTaskDB[task].status = newStatus;
        localStorage.setItem("taskList",JSON.stringify(newTaskDB));
        createTaskList();
    }
    //выыполнение задач
    document.querySelectorAll('.done-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            let taskListDOM = document.querySelectorAll('.task__item');
            let currentTask = taskListDOM[i];
            currentTask.style.backgroundColor = "#e8d0f57a";
            currentTask.style.padding = "25px";
            currentTask.style.boxShadow = "0 0 10px 5px #cd94e4";
            currentTask.style.borderRadius = "10px";
            currentTask.style.letterSpacing = "2px";
            setTimeout(function () {
                currentTask.style.height = "0";
                currentTask.style.fonSize = "0";
                currentTask.style.padding = "0";
                currentTask.style.opacity = "0";
                
            }, 800);
            setTimeout(function() {
                changeStatus(i,'complete');
            },2000);
        });
    });
    // вернуть задачу из выполненных
    document.querySelectorAll('.return-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            changeStatus(i,'progress');
        });
    })

    //редактирование задачи
    document.querySelectorAll('.edit-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            let taskListDOM = document.querySelectorAll('.task__item');
            let currentTask = taskListDOM[i];
            let textCurrentTask = currentTask.querySelector('.task__descr');
            let textOld = textCurrentTask.textContent;
            currentTask.innerHTML = `<input type ="text" class="task__descr-edit" value ="${textOld}">
                                        <div class="task__wrapper-btns">
                                            <button class="done-btn">done</button>
                                        </div>`
            
            let currentComplete = currentTask.querySelector('.done-btn');
            let editText = document.querySelector(".task__descr-edit");

            let saveChange = function () {
                newTaskDB[i].text = editText.value;
                localStorage.setItem("taskList",JSON.stringify(newTaskDB));
                createTaskList();
            }

            editText.addEventListener('keydown', (e) => {
                if(e.code === 'Enter') {
                    saveChange();
                }
            })

            currentComplete.addEventListener('click', () => {
                saveChange();
            })

        })
    })


    // новая задача
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        if(formInput.value === '') {
            return;
        }
        updateTaskDB = JSON.parse(localStorage.getItem("taskList"));
        let textNewTask = formInput.value;
        updateTaskDB.push({text: textNewTask, status: 'progress'})
        localStorage.setItem("taskList",JSON.stringify(updateTaskDB));
        formInput.value = '';
        createTaskList();
    })


}


//сортировка задач

let sortTaskList = function (item, status) {
    if (btnDone.dataset.checked == 'checked') {
        if (status === 'progress') {
            item.classList.add('hide');
        } else {
            item.classList.remove('hide');
        }
    }
    
    if(btnProgress.dataset.checked == 'checked') {
        if(status === 'complete') {
            item.classList.add('hide');
        } else {
            item.classList.remove('hide');
        }
    }
}

btnDone.addEventListener('click', () => {
    btnProgress.dataset.checked = '';
    btnDone.dataset.checked = 'checked';
    let taskListDOM = document.querySelectorAll('.task__item');
    taskListDOM.forEach((task) =>{
        task.style.opacity = "0";
    });
    setTimeout(function() {
        createTaskList();
    }, 500);
    
});

btnProgress.addEventListener('change', () => {
    btnDone.dataset.checked = '';
    btnProgress.dataset.checked = 'checked';
    let taskListDOM = document.querySelectorAll('.task__item');
    taskListDOM.forEach((task) =>{
        task.style.opacity = "0";
    });
    setTimeout(function() {
        createTaskList();
    }, 500);
});

//создание задачи из массива

let createTask = function (text, status) {
    let task = document.createElement('div');
    task.classList.add('task__item');
    task.innerHTML = `<p class="task__descr">${text}</p>
                                <div class="task__wrapper-btns">
                                    <button class="trash-btn">trash</button>
                                    <button class="return-btn">done</button>
                                    <button class="edit-btn">edit</button>
                                    <button class="done-btn">done</button>
                                </div>`;
    if (status === 'complete') {
        task.classList.add('complete');
        countDone ++;
    } else {
        countProgress ++;
    }
    task.draggable = true;
    sortTaskList(task, status);
    taskWrapper.append(task);
}



createTaskList();







