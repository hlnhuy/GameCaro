const socket = io();

const boardDiv = document.getElementById("board");
const startPopup = document.getElementById("start-popup");

const size = 15;

let myPlayer = null;
let myTurn = false;


for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.onclick = () => {
        
        if (!myTurn) return;

        const x = Math.floor(i / size);
        const y = i % size;
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

    
    const playerLeft = document.getElementById("player-left");
    const playerRight = document.getElementById("player-right");

    if (myPlayer === "X") {
        playerLeft.innerText = "Bạn: X";
        playerRight.innerText = "Đối thủ: O";
    } else {
        playerLeft.innerText = "Bạn: O";
        playerRight.innerText = "Đối thủ: X";
    }
});


socket.on("update_board", data => {
    const index = data.x * size + data.y;
    if (boardDiv.children[index]) {
        boardDiv.children[index].innerText = data.player;
    }
});


socket.on("turn_change", data => {
    myTurn = (data.turn === myPlayer);
    

    console.log(myTurn ? "Lượt của bạn" : "Lượt đối thủ");
});
