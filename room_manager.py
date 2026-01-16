class GameRoom:
    def __init__(self):
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"
        self.score = {"X": 0, "O": 0}

    def reset_board(self):
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"

    def switch_turn(self):
        players = ["X", "O"]
        new_index = 1 - players.index(self.current_turn)
        self.current_turn = players[new_index]

if _name_ == "_main_":
    game = GameRoom()
    print(f"Bắt đầu với: {game.current_turn}")
    game.switch_turn()
    print(f"Chuyển sang: {game.current_turn}")