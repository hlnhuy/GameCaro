const socket = io();

const boardDiv = document.getElementById("board");
const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-message");
const startPopup = document.getElementById("start-popup");

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
    boardDiv.children[index].innerText = data.player;
});

socket.on("turn_change", data => {
    myTurn = (data.turn === myPlayer);
});

socket.on("game_over", data => {
    gameEnded = true; 
    myTurn = false;
    popup.classList.remove("hidden");
    popupMsg.innerText = `${data.winner} đã giành chiến thắng!`;
    document.getElementById("scoreX").innerText = data.score.X;
    document.getElementById("scoreO").innerText = data.score.O;
    
    console.log("Trận đấu kết thúc. Người thắng:", data.winner);
});