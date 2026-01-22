from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from room_manager import GameRoom
from game_logic import check_win
import random
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

room = GameRoom()
players = {}
start_requests = set()
replay_requests = set()

game_started = False
roles_assigned = False
turn_timer = None
TURN_TIME = 20


def stop_turn_timer():
    global turn_timer
    if turn_timer:
        turn_timer.cancel()
        turn_timer = None


def start_turn_timer():
    global turn_timer

    def time_out():
        global game_started
        if not game_started:
            return

        loser = room.current_turn
        winner = "O" if loser == "X" else "X"
        room.score[winner] += 1
        game_started = False

        socketio.emit("game_over", {
            "winner": winner,
            "reason": "timeout",
            "score": room.score
        })

    stop_turn_timer()
    turn_timer = threading.Timer(TURN_TIME, time_out)
    turn_timer.start()


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def on_connect():
    players[request.sid] = None


@socketio.on("disconnect")
def on_disconnect():
    global roles_assigned, game_started
    players.pop(request.sid, None)
    start_requests.discard(request.sid)
    replay_requests.discard(request.sid)
    stop_turn_timer()

    if len(players) < 2:
        roles_assigned = False
        game_started = False
        start_requests.clear()
        replay_requests.clear()


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
    start_turn_timer()


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

    stop_turn_timer()

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
            "reason": "win",
            "score": room.score
        }, broadcast=True)
        return

    room.switch_turn()
    emit("turn_change", {"turn": room.current_turn}, broadcast=True)
    start_turn_timer()


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
    start_turn_timer()


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
