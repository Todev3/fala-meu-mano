/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const url = new URLSearchParams(window.location.search);
const params = Object.fromEntries(url.entries());

const receiver = Number(params.receiver);
const username = params.username;

if (!username) {
  window.alert("Sério todelover? cadê seu nome? preencha e volte!");
  window.location.href = "/index.html";
}

const mainSection = document.querySelector("#main-section");
const divMessages = document.querySelector("#messages");
const divUsers = document.querySelector("#users");

if (!receiver) {
  mainSection.innerHTML = /* html */ `
    <div class="max-w-md flex flex-col select-none pointer-events-none items-center opacity-30 justify-center mx-auto animate-pulse py-8 space-y-4 text-black">
        <img class="w-40 h-40" src="https://static.thenounproject.com/png/4147389-200.png"/>
        <h1 class="text-lg text-center uppercase font-medium">Escolha outro todelover ao lado, ${username}</h1>
    </div>
  `;
}

const btnSidebar = document.querySelector("#btn-sidebar");
const sidebar = document.querySelector("#sidebar");

btnSidebar.addEventListener("click", () => {
  btnSidebar.classList.toggle("active");
  sidebar.classList.toggle("active");
});

// create connection
const socket = io({
  extraHeaders: {
    id: username,
  },
});

if (receiver) {
  const inputMessage = document.querySelector("#inMessage");
  const btnMessage = document.querySelector("#btnMessage");

  const sendMessage = () => {
    const { value } = inputMessage;
    if (value.trim() !== "") {
      const data = JSON.stringify({
        receiverId: receiver,
        msg: value,
      });

      socket.emit("message", data);
      setMessageHTML(username, value, new Date());

      inputMessage.value = "";
      return;
    }

    inputMessage.focus();
  };

  inputMessage.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  btnMessage.addEventListener("click", sendMessage);
}

// methods (on)
socket.on("msg", (data) => {
  notifyMessage(data);
  data.forEach(({ senderId, msg, date }) => {
    if (senderId === receiver) {
      setMessageHTML(senderId, msg, date);
    }
  });
});

socket.on("users", (data) => {
  divUsers.innerHTML = "";
  data.forEach(({ id, name, online }) =>{
    if (name !== username) { 
      setButtonLinkUser(id, name, online);
    }
  });

});

socket.emit("history", JSON.stringify({
  senderId: receiver,
  size: 60,
}));

socket.on("history", (data) => {
  console.log(data)
  data.reverse().forEach(({ senderId, msg, date }) => {
    setMessageHTML(senderId, msg, date);
  });
});

// UTILS

function notifyMessage(data = []) {
  const title = document.title;
  let notification = 0;
  const soundNotify = new Audio("../assets/notify.mp3");

  data.forEach((msg) => {
    const btnUser = document.querySelector(`[data-userid="${msg.senderId}"]`);
    const existsNotification = Number(btnUser.getAttribute("data-notify")) ?? 0;

    notification =
      data.length + existsNotification > 9
        ? "+9"
        : data.length + existsNotification;

    if (msg.senderId !== receiver) {
      btnUser.setAttribute("data-notify", notification);
    }

    document.title = `(${notification}) · Mensagens`;
    soundNotify.volume = 0.8;
    soundNotify.play();

    setTimeout(() => {
      document.title = title;
    }, 4000);
  });
}

function formatDate(date) {
  const formatter = Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return formatter.format(new Date(date));
}

function setMessageHTML(senderId, msg, date) {
  const element = document.createElement("div");
  const isSender = senderId !== receiver;

  element.innerHTML = /* html */ `
    <div class="message ${isSender ? "right" : "left"}">
        <p>${msg}</p>
        <time>${formatDate(date)}</time>
    </div>
    `;

  divMessages.append(element);
  window.scrollTo(0, mainSection.scrollHeight);
}

function setButtonLinkUser(id, name, online) {
  const element = document.createElement("li");
  const { pathname } = window.location;

  element.innerHTML = /* html */ `
    <a
        href="${pathname}?username=${username}&receiver=${id}"
        data-userid="${id}"
        data-active="${id === receiver}"
        class="transition-all flex items-center gap-4 p-4 text-sm text-gray-400 rounded-lg hover:bg-zinc-800 hover:text-white">
        <svg 
          stroke="${online ? "#4f7" : "#f47"}" 
          fill="none" stroke-width="2" viewBox="0 0 24 24"
          stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em"
          xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <div>    
            <span>${name}</span>
        </div>
    </a>
    `;

  divUsers.append(element);
}
