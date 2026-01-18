const socket = io();

const boardDiv = document.getElementById("board");
const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-message");
const replayBtn = document.getElementById("replay-btn");
const startPopup = document.getElementById("start-popup");

const size = 15;

let myPlayer = null;
let myTurn = false;
let waitingReplay = false;
let gameEnded = false;

// ===== TẠO BÀN CỜ =====
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

// ===== BẮT ĐẦU =====
function startGame() {
    socket.emit("start_game");
}

socket.on("waiting_start", () => {
    startPopup.style.display = "flex";
});

socket.on("waiting_other_player", () => {
    startPopup.style.display = "flex";
});

// ===== NHẬN QUÂN & HIỂN THỊ TRẠNG THÁI =====
socket.on("assign_player", data => {
    myPlayer = data.players[socket.id];
    startPopup.style.display = "none";

    const left = document.getElementById("player-left");
    const right = document.getElementById("player-right");

    if (myPlayer === "X") {
        myTurn = true; 
        left.innerText = "Bạn: X";
        right.innerText = "Đối thủ: O";
    } else {
        myTurn = false; 
        left.innerText = "Bạn: O";
        right.innerText = "Đối thủ: X";
    }
});

// ===== UPDATE BÀN CỜ =====
socket.on("update_board", data => {
    const index = data.x * size + data.y;
    const targetCell = boardDiv.children[index];
    
    targetCell.innerText = data.player;
    // Tối ưu UI: Thêm màu sắc riêng cho X và O
    targetCell.classList.add(data.player.toLowerCase()); 
});

// ===== ĐỔI LƯỢT =====
socket.on("turn_change", data => {
    myTurn = (data.turn === myPlayer);
    
    // Tối ưu UX: Highlight vùng hiển thị khi đến lượt
    const left = document.getElementById("player-left");
    const right = document.getElementById("player-right");
    
    if (myTurn) {
        left.classList.add("active-turn");
        right.classList.remove("active-turn");
    } else {
        left.classList.remove("active-turn");
        right.classList.add("active-turn");
    }
});

// ===== KẾT THÚC GAME =====
socket.on("game_over", data => {
    gameEnded = true;
    myTurn = false;

    popup.classList.remove("hidden");
    popupMsg.innerText = `${data.winner} thắng!`;
    replayBtn.style.display = "inline-block";

    document.getElementById("scoreX").innerText = data.score.X;
    document.getElementById("scoreO").innerText = data.score.O;
});

// ===== CHƠI LẠI =====
function requestReplay() {
    waitingReplay = true;
    replayBtn.style.display = "none";
    popupMsg.innerText = "Đang đợi đối thủ...";
socket.emit("request_replay");
}

// ===== RESET BÀN =====
socket.on("reset_board", () => {
    for (let cell of boardDiv.children) {
        cell.innerText = "";
        cell.classList.remove("x", "o"); // Xóa màu cũ
    }

    waitingReplay = false;
    gameEnded = false;
    popup.classList.add("hidden");
    myTurn = (myPlayer === "X");
});