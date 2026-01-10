from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from room_manager import GameRoom
from game_logic import check_win
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Khởi tạo đối tượng quản lý phòng
room = GameRoom()

# Các biến quản lý trạng thái ván đấu
players = {}             # sid -> X / O
start_requests = set()
replay_requests = set()
game_started = False
roles_assigned = False

@app.route("/")
def index():
    return render_template("index.html")

# Lần up 4: Xử lý kết nối
@socketio.on("connect")
def on_connect():
    players[request.sid] = None

# Lần up 5: Xử lý ngắt kết nối
@socketio.on("disconnect")
def on_disconnect():
    global roles_assigned, game_started
    players.pop(request.sid, None)
    start_requests.discard(request.sid)
    replay_requests.discard(request.sid)

    if len(players) < 2:
        roles_assigned = False
        game_started = False
        start_requests.clear()
        replay_requests.clear()

# Lần up 6: Bắt đầu game và cơ chế chờ
@socketio.on("start_game")
def start_game():
    global game_started, roles_assigned
    start_requests.add(request.sid)

    if len(start_requests) < 2:
        emit("waiting_other_player", room=request.sid)
        return

    # Lần up 7: Logic phân vai X và O ngẫu nhiên
    if not roles_assigned:
        sids = list(start_requests)[:2]
        random.shuffle(sids)

        players[sids[0]] = "X"
        players[sids[1]] = "O"
        roles_assigned = True

        emit("assign_player", {
            "players": {
                sids[0]: "X",
                sids[1]: "O"
            }
        }, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)