# 🎮 GAME CỜ CARO ONLINE

Game Cờ Caro Online là một ứng dụng web cho phép hai người chơi đánh cờ caro  theo thời gian thực thông qua trình duyệt. Game hỗ trợ hiển thị lượt đi, đếm ngược thời gian cho mỗi lượt và xử lý thua cuộc khi người chơi hết thời gian mà không đánh.

---

##  Mô tả game

- Người chơi được chia ngẫu nhiên ký hiệu **X** hoặc **O**
- Hai người chơi đánh luân phiên trên bàn cờ **15x15**
- Mỗi lượt chơi có **20 giây**
- Nếu hết 20 giây mà người chơi không đánh nước nào thì **bị xử thua**
- Game tự động xác định người thắng
- Có popup bắt đầu game và popup thông báo kết quả

---

##  Tính năng chính

- Bàn cờ caro 15x15
- Chơi 2 người theo lượt
- Hiển thị người chơi, đối thủ và tỷ số
- Hiển thị lượt đi hiện tại
- Đếm ngược thời gian cho mỗi lượt
- Tự động xử thua khi hết thời gian
- Giao diện có ảnh nền, nổi bật bàn cờ
- Kết nối realtime bằng Socket.IO

---

##  Công nghệ sử dụng

- Python
- Flask
- Flask-SocketIO
- HTML
- CSS
- JavaScript

---

## ▶️ Cách chạy chương trình

- Sau khi cài đặt đầy đủ thư viện, mở thư mục chứa source code và chạy lệnh trên terminal:

pip install flask flask-socketi

python server.py

- Sau đó mở trình duyệt và truy cập địa chỉ:

http://127.0.0.1:5000


