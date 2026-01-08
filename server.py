from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def on_connect():
    print("Client connected:", request.sid)
    emit("connected", {"msg": "Connected to server"})


@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected:", request.sid)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
