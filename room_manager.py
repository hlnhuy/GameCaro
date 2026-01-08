class GameRoom:
    def __init__(self):
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"
        self.score = {"X": 0, "O": 0}

    def reset_board(self):
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"

    def switch_turn(self):
        self.current_turn = "O" if self.current_turn == "X" else "X"