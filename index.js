const chat = document.querySelector(".chat-container");
const send_button = document.querySelector(".send");
const text = document.querySelector(".message-area textarea");
const close = document.querySelector(".close-icon");
const chatContainer = document.querySelector(".chatbot");
const message_button = document.querySelector(".start-icon");




const addMessage = (message, state) => {
    const container = document.createElement("div");
    if(state === "outgoing") {
        container.classList.add("message", "msg-bot");
        container.innerHTML = `<span class="bot-icon"><i class="fas fa-robot"></i></span><p class="msg bot"></p>`;
    }else{
        container.classList.add("message", "msg-user");
        container.innerHTML = `<p class="msg user"></p>`;
    }

    container.querySelector("p").textContent = message;

    return container;
}

const GenerateResponse = async (userMessage) => {
    const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage }),
    });

    const data = await response.json();
    return data.reply;
}

const handleStart = () => {
    chatContainer.style.display = "flex";
    message_button.style.display = "none";
}

const handleClose = () => {
    chatContainer.style.display = "none";
    message_button.style.display = "flex";
}

const handleClick = async () => {
    let message = text.value.trim();
    if (!message) return;
    chat.appendChild(addMessage(message, "ingoing"));
    chat.scrollTo(0, chat.scrollHeight);
    try {
        const botReply = await GenerateResponse(message);
        chat.appendChild(addMessage(botReply, "outgoing"));
        chat.scrollTo(0, chat.scrollHeight);
    } catch (error) {
        console.error("Error fetching response:", error);
    }

    text.value = "";
}

send_button.addEventListener("click", handleClick);
close.addEventListener("click", handleClose);
message_button.addEventListener("click", handleStart);