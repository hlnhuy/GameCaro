from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from room_manager import GameRoom
from game_logic import check_win
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

room = GameRoom()

players = {}            # sid -> X / O
start_requests = set()
replay_requests = set()
game_started = False
roles_assigned = False


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def on_connect():
    players[request.sid] = None
    emit("waiting_start")


@socketio.on("disconnect")
def on_disconnect():
    players.pop(request.sid, None)
    start_requests.discard(request.sid)
    replay_requests.discard(request.sid)


# ===== BẮT ĐẦU GAME =====
@socketio.on("start_game")
def start_game():
    global game_started, roles_assigned

    start_requests.add(request.sid)

    if len(start_requests) < 2:
        emit("waiting_other_player", room=request.sid)
        return

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

    room.reset_board_only()
    game_started = True
    start_requests.clear()

    emit("turn_change", {"turn": room.current_turn}, broadcast=True)


# ===== ĐÁNH CỜ =====
@socketio.on("make_move")
def make_move(data):
    global game_started

    if not game_started:
        return

    sid = request.sid
    player = players.get(sid)

    if player != room.current_turn:
        return

    x, y = data["x"], data["y"]

    if room.board[x][y] is not None:
        return

    room.board[x][y] = player

    emit("update_board", {
        "x": x,
        "y": y,
        "player": player
    }, broadcast=True)

    if check_win(room.board, x, y):
        room.score[player] += 1
        game_started = False

        emit("game_over", {
            "winner": player,
            "score": room.score
        }, broadcast=True)
        return

    room.switch_turn()
    emit("turn_change", {"turn": room.current_turn}, broadcast=True)


# ===== CHƠI LẠI =====
@socketio.on("request_replay")
def request_replay():
    global game_started

    replay_requests.add(request.sid)

    if len(replay_requests) < 2:
        return

    replay_requests.clear()
    room.reset_board_only()
    game_started = True

    emit("reset_board", broadcast=True)
    emit("turn_change", {"turn": room.current_turn}, broadcast=True)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
