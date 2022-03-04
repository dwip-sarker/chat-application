// get socket io
const socket = io();

// all veriables
let username;
var messageArea = document.querySelector(".message_area");
const sendBtton = document.querySelector("#sendButton");
const inputField = document.querySelector("#inputField");
const peopleBtn = document.querySelector(".peoples");
const bakcBtn = document.querySelector(".back");
const peopleArea = document.querySelector(".people-area");
const userCount = document.querySelector(".users-count");
const usersList = document.querySelector(".users-list");

peopleBtn.addEventListener("click", () => {
  peopleArea.style.display = "block";
});

bakcBtn.addEventListener("click", () => {
  peopleArea.style.display = "none";
});

// showing up newer message
messageArea.scrollTop = messageArea.scrollHeight;

//if user do not fell the input the prompt will come agin and again
do {
  username = prompt("Enter you name....");
} while (!username);

//new user join emait
socket.emit("new-user-joined", username);

// user join left handle
socket.on("user-connected", (socket_name) => {
  userJoinLeft(socket_name, "joined");
});

function userJoinLeft(name, status) {
  let smallElement = document.createElement("small");
  smallElement.classList.add("notice");
  let content = `${name} ${status} the Chat`;
  smallElement.innerHTML = content;
  messageArea.appendChild(smallElement);
}

socket.on("user-disconnected", (user) => {
  userJoinLeft(user, "Left");
});

//message send hendler
sendBtton.addEventListener("click", () => {
  let data = {
    user: username,
    msg: inputField.value,
  };
  if (inputField.value != "") {
    outgoingMsg(data, "right");
    socket.emit("message", data);
    inputField.value = "";
  }
});

function outgoingMsg(data, status) {
  let sideDiv = document.createElement("div");
  sideDiv.classList.add(status);
  content = `<div class="msg-box">${data.msg}</div> <small class="time-date">friday 11:25AM </small>`;
  sideDiv.innerHTML = content;
  messageArea.appendChild(sideDiv);
}
function incomeingMessage(data, status) {
  let sideDiv = document.createElement("div");
  sideDiv.classList.add(status);
  content = `<div class="msg-box"><span class="sender">${data.user}</span>${data.msg}</div><span class="time-date">friday 11:25AM </span>`;
  sideDiv.innerHTML = content;
  messageArea.appendChild(sideDiv);
}

socket.on("message", (data) => {
  incomeingMessage(data, "left");
});

socket.on("user-list", (users) => {
  usersList.innerHTML = "";
  userArr = Object.values(users);
  for (i = 0; i < userArr.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = userArr[i];
    usersList.appendChild(li);
  }
  userCount.innerHTML = `Peoples (${userArr.length})`;
});
