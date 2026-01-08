const socket = io();
const board = document.getElementById("board");
const size = 15;

socket.on("connected", data => {
    console.log(data.msg);
});

// Tạo bàn cờ 15x15
for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => {
        cell.innerText = "X"; // test click
    };
    board.appendChild(cell);
}