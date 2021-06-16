//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const temp = document.querySelector(".temp");
const icon = document.querySelector("#weather-icon");
const body = document.querySelector("#body");

const fakeData = {
  coord: { lon: -87.65, lat: 41.85 },
  weather: [
    { id: 804, main: "Clouds", description: "overcast clouds", icon: "13d" },
  ],
  base: "stations",
  main: {
    temp: 290.07,
    feels_like: 285.13,
    temp_min: 289.82,
    temp_max: 290.37,
    pressure: 1021,
    humidity: 36,
  },
  visibility: 10000,
  wind: { speed: 4.61, deg: 192, gust: 7.45 },
  clouds: { all: 94 },
  dt: 1616431771,
  sys: {
    type: 3,
    id: 2005153,
    country: "US",
    sunrise: 1616413799,
    sunset: 1616457881,
  },
  timezone: -18000,
  id: 4887398,
  name: "Chicago",
  cod: 200,
};

// parseData(fakeData);

let now = new Date();

//test
let time = now.getHours();
if (time < 12) {
  body.classList = "body-morning";
} else if (time > 12 && time < 17) {
  body.classList = "body-day";
} else if (time > 16 && time < 20) {
  body.classList = "body-evening";
} else if (time > 20) {
  body.classList = "body-night";
}

progressBar();

//Event listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo); //also adding weather update when adding a todo
todoList.addEventListener("click", deleteCheck);
todoList.addEventListener("click", finishedCheck);
filterOption.addEventListener("click", filterTodo);

// weather API
function getWeatherData() {
  const response = fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=f49f0e7908fb08acbf988ff3a0bfaea3"
  )
    .then((response) => response.json())
    .then((data) => parseData(data));
}

//functions

function parseData(data) {
  temp.innerHTML = kelToF(data.main.temp) + " &#176;"; //set temp
  //set icons
  //clouds
  if (data.weather[0].icon == "04d" || data.weather[0].icon == "04n") {
    icon.classList = "ri-cloudy-fill";
  } else if (
    data.weather[0].icon == "03d" ||
    data.weather[0].icon == "03n" ||
    data.weather[0].icon == "02d" ||
    data.weather[0].icon == "02n"
  ) {
    icon.classList = "ri-sun-cloudy-fill";
  }
  //clear
  else if (data.weather[0].id == 800) {
    icon.classList = "ri-sun-fill";
  }
  //foggy icon
  else if (data.weather[0].icon == "50d") {
    icon.classList = "ri-mist-fill";
  }
  //snow
  else if (data.weather[0].icon == "13d") {
    icon.classList = "ri-snowy-fill";
  }
  //rain
  else if (data.weather[0].icon == "10d" || data.weather[0].icon == "09d") {
    icon.classList = "ri-heavy-showers-fill";
  } else if (data.weather[0].icon == "11d") {
    icon.classList = "ri-thunderstorms-fill";
  }
  // unknown
  else {
    icon.classList = "ri-question-mark";
  }
}

function kelToF(tempK) {
  return Math.round((tempK * 9) / 5 - 459.67);
}

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

//make progress bar update
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

  let percentProg = 0.0;
  percentProg = done / total;

  percentProg *= 100;
  // console.log(percent, done, total);

  gsap.to("#progress-bar", 1, { width: percentProg + "%" });

  refresh();
}
//set the progress bar that shows time
function timerBar() {
  let percent;
  let currentMin = 0;
  let time = new Date();
  totalMin = 450; // 7.5 hours in min
  startHour = 8;
  startMin = 30;
  currentMin =
    (time.getHours() - startHour) * 60 + (time.getMinutes() - startMin); // number of min since 8:30 am
  if (time.getHours() == startHour && time.getMinutes() == startMin) {
    //start timer
  }
  percent = currentMin / totalMin;
  console.log(currentMin);
  percent *= 100;
  if (percent > 100) {
    percent = 100;
  }
  console.log(time.getHours() + ":" + time.getMinutes());
  console.log(percent);
  gsap.to("#timer", 1, { width: percent + "%" });
  if (percent >= 100) {
    document.getElementById("timer").classList.add("progressComplete");
  }
}

function refresh() {
  getWeatherData(); //updates weather info
  timerBar(); //updates timer bar
}
