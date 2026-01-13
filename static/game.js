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
        
        console.log(`Gửi nước đi: [${x}, ${y}]`);
        socket.emit("make_move", { x, y });
    };

    boardDiv.appendChild(cell);
}

function startGame() {
    socket.emit("start_game");
}

socket.on("waiting_start", () => {
    startPopup.style.display = "flex";
});

socket.on("waiting_other_player", () => {
    startPopup.style.display = "flex";
});

socket.on("assign_player", data => {
    myPlayer = data.players[socket.id];
    startPopup.style.display = "none";
    console.log("Bạn là người chơi: " + myPlayer);
});

socket.on("update_board", data => {
    const index = data.x * size + data.y;
    if (boardDiv.children[index]) {
        boardDiv.children[index].innerText = data.player;
    }
});

socket.on("turn_change", data => {
    myTurn = (data.turn === myPlayer);
    if (myTurn) {
        console.log("Đến lượt bạn đánh!");
    } else {
        console.log("Đợi đối thủ...");
    }
});