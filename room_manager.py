class GameRoom:
    def __init__(self):
        self.board = []
        for i in range(15):
            row = [None] * 15
            self.board.append(row)
        
        self.current_turn = "X"
        self.player_x_score = 0
        self.player_o_score = 0

    def reset_game(self):
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"

    def change_turn(self):
        if self.current_turn == "X":
            self.current_turn = "O"
        else:
            self.current_turn = "X"

if _name_ == "_main_":
    game = GameRoom()
    print(f"Lượt hiện tại: {game.current_turn}")
    game.change_turn()
    print(f"Lượt sau khi đổi: {game.current_turn}")