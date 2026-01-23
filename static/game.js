const socket = io();

const boardDiv = document.getElementById("board");
const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-message");
const replayBtn = document.getElementById("replay-btn");
const startPopup = document.getElementById("start-popup");
const startBtn = document.querySelector("#start-popup button");

const timerDiv = document.getElementById("timer");
const turnInfoDiv = document.getElementById("turn-info");

const size = 15;

let myPlayer = null;
let myTurn = false;
let waitingReplay = false;
let gameEnded = false;
let hasClickedStart = false;

let timeLeft = 20;
let timerInterval = null;

for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.onclick = () => {
        if (!myTurn || waitingReplay || gameEnded) return;

        const x = Math.floor(i / size);
        const y = i % size;
        socket.emit("make_move", { x, y });
    };

    boardDiv.appendChild(cell);
}

function startGame() {
    if (hasClickedStart) return;

    hasClickedStart = true;
    startBtn.disabled = true;
    startBtn.innerText = "Đang đợi đối thủ...";
    socket.emit("start_game");
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    timerDiv.innerText = `${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDiv.innerText = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

socket.on("assign_player", data => {
    myPlayer = data.players[socket.id];
    startPopup.style.display = "none";

    if (myPlayer === "X") {
        document.getElementById("player-left").innerText = "Bạn: X";
        document.getElementById("player-right").innerText = "Đối thủ: O";
    } else {
        document.getElementById("player-left").innerText = "Bạn: O";
        document.getElementById("player-right").innerText = "Đối thủ: X";
    }
});

socket.on("update_board", data => {
    const index = data.x * size + data.y;
    const cell = boardDiv.children[index];

    cell.innerText = data.player;
    cell.classList.remove("x", "o");

    if (data.player === "X") {
        cell.classList.add("x");
    } else if (data.player === "O") {
        cell.classList.add("o");
    }
});

socket.on("turn_change", data => {
    myTurn = (data.turn === myPlayer);
    turnInfoDiv.innerText = `Lượt đánh: ${data.turn}`;
    startTimer();
});

socket.on("game_over", data => {
    gameEnded = true;
    myTurn = false;
    stopTimer();

    popup.classList.remove("hidden");

    if (data.reason === "timeout") {
        popupMsg.innerText = `${data.winner} thắng (đối thủ hết thời gian)`;
    } else {
        popupMsg.innerText = `${data.winner} thắng!`;
    }

    replayBtn.style.display = "inline-block";
    document.getElementById("scoreX").innerText = data.score.X;
    document.getElementById("scoreO").innerText = data.score.O;
});

function requestReplay() {
    waitingReplay = true;
    replayBtn.style.display = "none";
    popupMsg.innerText = "Đang đợi đối thủ...";
    socket.emit("request_replay");
}

socket.on("reset_board", () => {
    for (let cell of boardDiv.children) {
        cell.innerText = "";
        cell.classList.remove("x", "o");
    }

    waitingReplay = false;
    gameEnded = false;
    popup.classList.add("hidden");
    stopTimer();
});
