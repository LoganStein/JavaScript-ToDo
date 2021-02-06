//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
todoList.addEventListener("click", finishedCheck);
filterOption.addEventListener("click", filterTodo);

//functions

function deleteCheck(event) {
  const item = event.target;
  var todoList = JSON.parse(localStorage.getItem("todos"));
  //delete todo
  var toRemove = todoList.findIndex(function (todoItem, index) {
    if (todoItem.text == item.parentElement.children[0].innerHTML) {
      if (todoItem.completed == false) {
        updateTo = true;
      } else {
        updateTo = false;
      }
      return true;
    }
  });
  if (item.classList[0] === "trash-btn") {
    gsap.to(item.parentElement, 0.5, {
      xPercent: 50,
      opacity: 0,
      ease: "Power2.out",
      onComplete: deleteItem,
      onCompleteParams: [toRemove, item.parentElement],
    });
  }
}

function deleteItem(x, forRemoval) {
  console.log(x);
  removeLocalTodos(x);
  forRemoval.remove();
  progressBar();
}

function finishedCheck(event) {
  const item = event.target;
  let updateTo;
  //crossout todo
  if (item.classList[0] === "complete-btn") {
    let todoList = [];
    let updateTo;
    todoList = JSON.parse(localStorage.getItem("todos"));

    var __FOUND = todoList.findIndex(function (todoItem, index) {
      if (todoItem.text == item.parentElement.children[0].innerHTML) {
        if (todoItem.completed == false) {
          updateTo = true;
        } else {
          updateTo = false;
        }
        return true;
      }
    });

    if (__FOUND != -1) {
      updateItem(__FOUND, updateTo);
    }
    console.log(__FOUND);
    console.log(item.parentElement.children[0].innerHTML);
    item.parentElement.classList.toggle("completed");
    // filterTodo(filterOption);
    // gsap.to(item.parentElement, 1, { opacity: 0.6 });
  }
  progressBar();
}

function addTodo(event) {
  event.preventDefault(); //prevent button from submitting and refreshing page
  if (todoInput.value != "") {
    //Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    //Add todo to local storage
    saveLocalTodos({ text: todoInput.value, completed: false });
    //empty todo input bar
    todoInput.value = "";
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //check mark button
    const completedBTN = document.createElement("button");
    completedBTN.innerHTML = '<i class="fas fa-check"></i>';
    completedBTN.classList.add("complete-btn");
    todoDiv.appendChild(completedBTN);
    //trash button
    const trashBTN = document.createElement("button");
    trashBTN.innerHTML = '<i class="fas fa-trash"></i>';
    trashBTN.classList.add("trash-btn");
    todoDiv.appendChild(trashBTN);
    //append to list
    todoList.appendChild(todoDiv);
    gsap.from(todoDiv, 0.5, {
      opacity: 0,
      yPercent: -50,
      ease: "Power2.in",
    });
  }
  progressBar();
}

function filterTodo(event) {
  const todos = todoList.childNodes;
  console.log(event.target.value);
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function updateItem(index, updateTo) {
  //Check for existing todos
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos[index].completed = updateTo;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function saveLocalTodos(todo) {
  //Check for existing todos
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo); // add todo to the array
  localStorage.setItem("todos", JSON.stringify(todos)); // push to local storage
}

function getTodos() {
  let todos;
  //check for local storage
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo) {
    //Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.completed) {
      todoDiv.classList.toggle("completed");
    }
    //create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.text;
    //empty todo input bar
    todoInput.value = "";
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //check mark button
    const completedBTN = document.createElement("button");
    completedBTN.innerHTML = '<i class="fas fa-check"></i>';
    completedBTN.classList.add("complete-btn");
    todoDiv.appendChild(completedBTN);
    //trash button
    const trashBTN = document.createElement("button");
    trashBTN.innerHTML = '<i class="fas fa-trash"></i>';
    trashBTN.classList.add("trash-btn");
    todoDiv.appendChild(trashBTN);
    //append to list
    todoList.appendChild(todoDiv);
    gsap.from(todoDiv, 0.5, {
      opacity: 0,
      yPercent: -50,
      ease: "Power2.in",
      stagger: 0.2,
    });
  });
}

function removeLocalTodos(toRemove) {
  //check for local storage
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.splice(toRemove, 1);
  localStorage.setItem("todos", JSON.stringify(todos)); // push to local storage
}

function progressBar() {
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  let done = 0;
  let total = todos.length;

  // console.log(todos);
  todos.forEach((element) => {
    if (element.completed) {
      done++;
    }
  });

  // console.log(todos);

  let percent = 0.0;
  percent = done / total;

  percent *= 100;
  // console.log(percent, done, total);

  gsap.to(".progress-bar", 1, { width: percent + "%" });
}
