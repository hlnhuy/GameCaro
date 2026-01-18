class GameRoom:
    def __init__(self) -> None:
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn: str = "X"
        self.score: dict = {"X": 0, "O": 0}

    def reset_board(self) -> None:
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"

    def switch_turn(self) -> None:
        self.current_turn = "O" if self.current_turn == "X" else "X"

if _name_ == "_main_":
    game = GameRoom()
    print(f"Board 15x15 ready. Score: {game.score}")
    game.switch_turn()
    print(f"Switching successful, current: {game.current_turn}")