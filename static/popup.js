;
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Lắng nghe sự kiện kết thúc từ server
socket.on("game_over", (data) => {
    // Hiển thị thông báo cơ bản
    popupMessage.innerText = "Trò chơi kết thúc!";
    
    // Sử dụng style.display để hiện popup thay vì classList
    popup.style.display = "flex"; 
    
    console.log("Dữ liệu nhận được:", data);
});

// Hàm reset game sơ khai
function resetGame() {
    // Ẩn popup bằng cách can thiệp style trực tiếp
    popup.style.display = "none";
    
    // Thông báo trạng thái chuẩn bị reset
    console.log("Đang thực hiện yêu cầu chơi lại...");
}