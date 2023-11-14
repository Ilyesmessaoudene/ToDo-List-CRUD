const task_input = document.querySelector("input");
const date_input = document.querySelector(".schedule-date"); 
const add_btn = document.querySelector(".add-task-button");
const todos_list_body = document.querySelector(".todos-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn")

// recup ref html button
const searchInput = document.querySelector("#search")

// ajout eventListener au change sur le btn
searchInput.addEventListener("input", function(event) {
  //console.log(event.target.value)
  // parcourir les todos et filtrer celles qui matchent avec la valeur de l'input
  filteredTodos = todos.filter((todo) => {
    // pour chaque todo on veut vérifier si la valeur de l'input est incluse dans le titre du todo
    const value = event.target.value
    return todo.task.includes(value)
  })

  console.log(filteredTodos)

  
  
 
})


let todos = JSON.parse(localStorage.getItem("todos")) || [];

console.log(todos)

window.addEventListener("DOMContentLoaded", () => {
  showAllTodos();
  if (!todos.length) {
    displayTodos([]);
  }
});


function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addToDo(task_input, date_input) {
  let task = {
    id: getRandomId(),
    task: task_input.value.length > 14 ? task_input.value.slice(0, 14) + "..." : task_input.value,
    dueDate: date_input.value,
    completed: false,
    status: "En attente",
  };
  todos.push(task);
}

task_input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && task_input.value.length > 0) {
    addToDo(task_input, date_input); 
    saveToLocalStorage();
    task_input.value = "";
    showAllTodos();
  }
});

add_btn.addEventListener("click", () => {
  if (task_input.value === "") {
    showAlertMessage("Merci d'enregistrer une tâche", "error");
  } else {
    addToDo(task_input, date_input);
    saveToLocalStorage();
    showAllTodos();
    task_input.value = "";
    date_input.value = "";
    showAlertMessage("Tâche ajoutée avec succes", "success");
  }
});

delete_all_btn.addEventListener("click", clearAllTodos);

function showAllTodos() {
  todos_list_body.innerHTML = "";
  
  if (todos.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">Aucune tâche écrite</td></tr>`;
    return;
  }

  todos.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "Aucune"}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}


function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}


function showAlertMessage(message, type) {
  let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}


function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  showAlertMessage("Tâche supprimée avec succès", "success");
  showAllTodos();
}


function editTodo(id) {
  let todo = todos.find((todo) => todo.id === id);
  task_input.value = todo.task;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  saveToLocalStorage();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Tâche mis a jour avec succès", "success");
  });
}


function clearAllTodos() {
  if (todos.length > 0) {
    todos = [];
    saveToLocalStorage();
    showAlertMessage("Tâche supprimée avec succès", "success");
    showAllTodos();
  } else {
    showAlertMessage("Aucune tâche à effacer", "error");
  }
}

function toggleStatus(id) {
  let todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  console.log("todo", todo);
  saveToLocalStorage();
  displayTodos(todos);
}

function filterTodos(status) {
  console.log(status)
  let filteredTodos;
  switch (status) {
    case "all":
      filteredTodos = todos;
      break;
    case "pending":
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed);
      break;
  }
  console.log(filteredTodos)
  displayTodos(filteredTodos);
}

function displayTodos(todosArray) {
  console.log (todosArray)
  todos_list_body.innerHTML = ""; 

  if (todosArray.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">Aucune tâche écrite</td></tr>`;
    return;
  }
  todosArray.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "Aucune"}</td>
                <td>${todo.completed ? "Terminer" : "En cours"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}

