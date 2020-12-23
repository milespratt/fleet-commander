// babel dependencies
import "regenerator-runtime/runtime"; // async-await
import { io } from "socket.io-client";

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";
import fontLoader from "./fontLoader";

async function init() {
  const universe = await loadData();
  await fontLoader();
  loadRenderer(universe);

  // sockets
  console.log(process.env.NODE_ENV);
  const socket = io("http://192.168.1.30");

  const inboxPeople = document.querySelector(".inbox__people");
  const inputField = document.querySelector(".message_form__input");
  const messageForm = document.querySelector(".message_form");
  const messageBox = document.querySelector(".messages__history");
  const fallback = document.querySelector(".fallback");

  let userName = "";

  const newUserConnected = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    socket.emit("new user", userName);
    addToUsersBox(userName);
  };

  const addToUsersBox = (userName) => {
    if (!!document.querySelector(`.${userName}-userlist`)) {
      return;
    }

    const userBox = `
      <div class="chat_ib ${userName}-userlist">
        <h5>${userName}</h5>
      </div>
    `;
    inboxPeople.innerHTML += userBox;
  };

  const addNewMessage = ({ user, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    const receivedMsg = `
    <div class="incoming__message message blue__glow">
      <div class="received__message">
        <p>${user}@${formattedTime}: ${message}</p>
      </div>
    </div>`;

    // <p>${message}</p>
    // <div class="message__info">
    //   <span class="message__author">${user}</span>
    //   <span class="time_date">${formattedTime}</span>
    // </div>

    const myMsg = `
    <div class="outgoing__message message white__glow">
      <div class="sent__message">
        <p>ME@${formattedTime}: ${message}</p>
      </div>
    </div>`;

    // <p>${message}</p>
    // <div class="message__info">
    //   <span class="time_date">${formattedTime}</span>
    // </div>

    messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
  };

  // new user is created so we generate nickname and emit event
  newUserConnected();

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputField.value) {
      return;
    }

    socket.emit("chat message", {
      message: inputField.value,
      nick: userName,
    });

    inputField.value = "";
  });

  // inputField.addEventListener("keyup", () => {
  //   socket.emit("typing", {
  //     isTyping: inputField.value.length > 0,
  //     nick: userName,
  //   });
  // });

  socket.on("new user", function (data) {
    data.map((user) => addToUsersBox(user));
    addNewMessage({ user: "SYSTEM", message: `${userName} joined` });
  });

  socket.on("user disconnected", function (userName) {
    document.querySelector(`.${userName}-userlist`).remove();
    addNewMessage({ user: "SYSTEM", message: `${userName} left` });
  });

  socket.on("chat message", function (data) {
    addNewMessage({ user: data.nick, message: data.message });
    messageBox.scrollTo(0, messageBox.scrollHeight);
  });

  socket.on("typing", function (data) {
    const { isTyping, nick } = data;

    if (!isTyping) {
      fallback.innerHTML = "";
      return;
    }

    fallback.innerHTML = `<p>${nick} is typing...</p>`;
  });
}

init();
