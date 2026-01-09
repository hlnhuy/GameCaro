const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-message");
const replayBtn = document.getElementById("replay-btn");

socket.on("game_over", data => {
    popup.classList.remove("hidden");
    popupMsg.innerText = `${data.winner} thắng!`;
    replayBtn.style.display = "inline-block";

    document.getElementById("scoreX").innerText = data.score.X;
    document.getElementById("scoreO").innerText = data.score.O;
});

function requestReplay() {
    replayBtn.style.display = "none";
    popupMsg.innerText = "Đang đợi đối thủ...";
    socket.emit("request_replay");
}

socket.on("reset_board", () => {
    popup.classList.add("hidden");
});