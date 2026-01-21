from game_logic import create_board

class GameRoom:
    def __init__(self):
        self.score = {"X": 0, "O": 0}
        self.start_new_match()

    def start_new_match(self):
        self.board = create_board()
        self.current_turn = "X"

    def reset_board_only(self):
        self.board = create_board()
        self.current_turn = "X"

    def switch_turn(self):
        self.current_turn = "O" if self.current_turn == "X" else "X"