const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Khi có người thắng
socket.on("game_over", data => {
    popupMessage.innerText = "🎉 Người thắng: " + data.winner;
    popup.classList.remove("hidden");

    // Cập nhật điểm
    document.getElementById("scoreX").innerText = data.score.X;
    document.getElementById("scoreO").innerText = data.score.O;
});
function resetGame() {
    popup.classList.add("hidden");
    socket.emit("reset_game");
}