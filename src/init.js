// babel dependencies
import "regenerator-runtime/runtime"; // async-await
import { io } from "socket.io-client";

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";
import fontLoader from "./fontLoader";
import windows from "./windows";
import loadControls from "./loadControls";
import loadAudio from "./audio";

async function init() {
  const universe = await loadData();
  await fontLoader();
  windows();
  // loadAudio();
  loadControls();
  loadRenderer(universe);

  const apiEndpoint =
    process.env.NODE_ENV === "dev"
      ? "http://192.168.1.30"
      : "https://api.fltcmdr.com";

  // sockets and chat
  // /*
  console.log(process.env.NODE_ENV);
  const socket = io(apiEndpoint);

  const inboxPeople = document.querySelector(".inbox__people");
  const inputField = document.getElementById("message_form_input");
  const messageForm = document.querySelector(".message_form");
  const messageBox = document.querySelector(".messages__history");
  const fallback = document.querySelector(".fallback");
  const signInForm = document.getElementById("signInForm");
  const signInUsername = document.getElementById("signInUsername");
  const signInPassword = document.getElementById("signInPassword");
  const formError = document.getElementById("formError");
  const inbox = document.getElementById("inbox");

  let userName = "";

  signInForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    // formError.innerText = `ERROR: CALL SIGN NOT FOUND`;
    fetch(`${apiEndpoint}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signInUsername.value,
        password: signInPassword.value,
      }),
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        const { error } = jsonRes;
        if (error) {
          formError.innerText = `ERROR: ${error}`;
        } else {
          document.activeElement.blur();
          formError.innerText = "";
          signInUsername.value = "";
          signInPassword.value = "";
          console.log(jsonRes);
          localStorage.setItem("token", jsonRes.token);
        }
      });
  });

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
      <p class="blue__glow chat__user ${userName}-userlist">
        ${userName}
      </p>
    `;
    inboxPeople.innerHTML += userBox;
  };

  const addNewMessage = ({ user, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", {
      // day: "numeric",
      // month: "numeric",
      // year: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // seconds: "numeric",
      dateStyle: "short",
      timeStyle: "medium",
      hour12: false,
      timeZone: "UTC",
    });
    // <p class="message__time__stamp"><span>[GLOBAL]</span><span>[${user}]</span> - ${formattedTime}</p>
    const receivedMsg = `
    <div class="incoming__message message blue__glow-- blue">
      <div class="received__message">
        <p class="message__time__stamp"><span class="message__user">[${user}]</span></p>
        <p class="message__body">${message}</p>
      </div>
    </div>`;

    // <p>${message}</p>
    // <div class="message__info">
    //   <span class="message__author">${user}</span>
    //   <span class="time_date">${formattedTime}</span>
    // </div>

    const myMsg = `
    <div class="outgoing__message message white__glow-- white">
      <div class="sent__message">
        <p class="message__time__stamp"><span class="message__user">[${user}]</span></p>
        <p class="message__body">${message}</p>
      </div>
    </div>`;

    // <p>${message}</p>
    // <div class="message__info">
    //   <span class="time_date">${formattedTime}</span>
    // </div>

    messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
    inbox.scrollTo(0, inbox.scrollHeight);
  };

  // new user is created so we generate nickname and emit event
  newUserConnected();

  function getInputValue() {
    // return inputField.value
    return inputField.innerText;
  }

  function setInputValue(value) {
    // inputField.value = value;
    inputField.innerText = value;
  }

  function submit() {
    if (!getInputValue()) {
      return;
    }

    socket.emit("chat message", {
      message: getInputValue(),
      nick: userName,
    });

    setInputValue("");
    typing();
  }

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submit();
  });
  function typing() {
    const isTyping = getInputValue().length > 0;
    // if (isTyping) {
    socket.emit("typing", {
      isTyping,
      nick: userName,
    });
    // }

    // const { isTyping, nick } = data;

    if (!isTyping) {
      fallback.innerHTML = "";
      return;
    }

    fallback.innerHTML = `<p>${userName} is typing...</p>`;
    inbox.scrollTo(0, inbox.scrollHeight);
  }

  // inputField.addEventListener("keyup", () => {
  //   typing();
  // });

  inputField.addEventListener("keydown", (ev) => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      submit();
    }
  });

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
    // messageBox.scrollTo(0, messageBox.scrollHeight);
  });

  socket.on("typing", function (data) {
    const { isTyping, nick } = data;

    if (!isTyping) {
      fallback.innerHTML = "";
      return;
    }

    fallback.innerHTML = `<p>${nick} is typing...</p>`;
  });
  // */
}

init();
