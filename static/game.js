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