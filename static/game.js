const socket = io();
const boardDiv = document.getElementById("board");
const size = 15;

let myPlayer = null;
let myTurn = false;
let gameEnded = false;

for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.onclick = () => {
        if (!myTurn || gameEnded) return;
        const x = Math.floor(i / size);
        const y = i % size;
        socket.emit("make_move", { x, y });
    };

    boardDiv.appendChild(cell);
}

function startGame() {
    socket.emit("start_game");
}

socket.on("assign_player", data => {
    myPlayer = data.players[socket.id];
    document.getElementById("start-popup").style.display = "none";
    myTurn = (myPlayer === "X");
});

socket.on("update_board", data => {
    const index = data.x * size + data.y;
    boardDiv.children[index].innerText = data.player;
});

socket.on("turn_change", data => {
    myTurn = (data.turn === myPlayer);
});

socket.on("game_over", () => {
    gameEnded = true;
});

socket.on("reset_board", () => {
    for (let cell of boardDiv.children) {
        cell.innerText = "";
    }
    gameEnded = false;
    myTurn = (myPlayer === "X");
});

const socket = io();
const boardDiv = document.getElementById("board");
const startPopup = document.getElementById("start-popup");
const size = 15;


let myPlayer = null;


for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    
    cell.onclick = () => {
       
        const x = Math.floor(i / size);
        const y = i % size;
        console.log("Click tại tọa độ:", x, y);
    };

    boardDiv.appendChild(cell);
}

function startGame() {
    console.log("Đang yêu cầu bắt đầu game...");
    socket.emit("start_game");
}


socket.on("waiting_start", () => {
    startPopup.style.display = "flex";
    console.log("Đang đợi người chơi nhấn Start...");
});

socket.on("waiting_other_player", () => {
    startPopup.style.display = "flex";
 
    console.log("Đã sẵn sàng, đợi đối thủ kết nối...");
});

socket.on("assign_player", data => {
    myPlayer = data.players[socket.id];
    startPopup.style.display = "none";
    alert("Bạn đã vào trận với vai trò: " + myPlayer);
});