const todoInput = document.querySelector(".todo-input");
const bodyInput = document.querySelector(".bodyInput-input"); // Fix typo in class name
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getServerTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoActions);
filterOption.addEventListener("change", filterTodo);


const userId = (JSON.parse(localStorage.getItem("user")) || "").id; // Handle cases where "user" key might not exist
console.log(userId);
const apiUrl = `https://6570538609586eff66412160.mockapi.io/todo/api/v1/Login/${userId}/todo`;

function addTodo(event) {
    event.preventDefault();

    const todoText = todoInput.value.trim();
    const todoBody = bodyInput.value.trim();

    if (!todoText || !todoBody) {
        return alert("Введите название и описание задачи");
    }

    const todo = { name: todoText, body: todoBody, completed: false };

    postTodoData(todo);
}

async function postTodoData(todo) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        });

        if (!response.ok) {
            throw new Error("Failed to add todo");
        }

        const newTodo = await response.json();
        displayTodo(newTodo);
        clearInputFields();
    } catch (error) {
        console.error(error);
    }
}

async function getServerTodos() {
    try {
        const response = await fetch(apiUrl);
        const todos = await response.json();
        todos.forEach(displayTodo);
    } catch (error) {
        console.error(error);
    }
}

function handleTodoActions(e) {
    const item = e.target;
    const todo = item.parentElement;

    if (item.classList.contains("trash-btn")) {
        deleteTodo(todo);
    } else if (item.classList.contains("complete-btn")) {
        toggleTodoCompletion(todo);
    } else if (item.classList.contains("editBtn-btn")) {
        updateTodoText(todo);
    }
}

async function deleteTodo(todo) {
    const todoId = todo.dataset.id;

    try {
        const response = await fetch(`${apiUrl}/${todoId}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }

        todo.remove();
    } catch (error) {
        console.error(error);
    }
}

async function toggleTodoCompletion(todo) {
    const todoId = todo.dataset.id;
    const completed = todo.classList.contains("completed");

    try {
        const response = await fetch(`${apiUrl}/${todoId}?completed=${!completed}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
        });

        if (!response.ok) {
            throw new Error("Failed to update todo");
        }

        todo.classList.toggle("completed");
    } catch (error) {
        console.error(error);
    }
}

function updateTodoText(todo) {
    const todoId = todo.dataset.id;
    const updatedText = prompt("Введитe название:");
    const updatedBody = prompt("Введите  задачу");

    if (updatedText !== null) {
        putTodoData(todoId, { name: updatedText, body: updatedBody });
        updateTodoUI(todo, updatedText, updatedBody);
    }
}

async function putTodoData(todoId, data) {
    try {
        await fetch(`${apiUrl}/${todoId}`, {
            method: "PUT",
            headers: { "Accept": "application/json", "Content-type": "application/json" },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error(error);
    }
}

function updateTodoUI(todo, updatedText, updatedBody) {
    const todoItem = todo.querySelector(".todo-item");
    const todoBodyItem = todo.querySelector(".todoBody-item");

    if (todoItem && todoBodyItem) {
        todoItem.innerText = updatedText;
        todoBodyItem.innerText = updatedBody;
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;

    todos.forEach(todo => {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "incomplete":
                todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}

function displayTodo(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.dataset.id = todo.id;

    const newTodo = createTodoElement("li", "todo-item", todo.name);
    const newTodoBody = createTodoElement("li", "todoBody-item", todo.body);

    const editButton = createTodoButton("Edit", "editBtn-btn");
    const completedButton = createTodoButton('<i class="fas fa-check-circle"></i>', "complete-btn");
    const trashButton = createTodoButton('<i class="fas fa-trash"></i>', "trash-btn");

    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(newTodoBody);
    todoDiv.appendChild(editButton);
    todoDiv.appendChild(completedButton);
    todoDiv.appendChild(trashButton);

    if (todo.completed) {
        todoDiv.classList.add("completed");
    }

    todoList.appendChild(todoDiv);
}

function createTodoElement(elementType, className, textContent) {
    const element = document.createElement(elementType);
    element.innerText = textContent;
    element.classList.add(className);
    return element;
}

function createTodoButton(innerHtml, className) {
    const button = document.createElement("button");
    button.innerHTML = innerHtml;
    button.classList.add(className);
    return button;
}

function clearInputFields() {
    todoInput.value = "";
    bodyInput.value = "";
}
