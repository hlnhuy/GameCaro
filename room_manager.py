class GameRoom:
    def __init__(self):
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"
        
        self.score = {"X": 0, "O": 0}

    def reset_board(self):
        """Đã đổi tên từ reset_game sang reset_board cho đúng ý nghĩa"""
        self.board = [[None for _ in range(15)] for _ in range(15)]
        self.current_turn = "X"
        print("Board has been cleared for a new match.")

    def switch_turn(self):
        """Logic đổi lượt đã rõ ràng hơn nhưng vẫn dùng if-else truyền thống"""
        if self.current_turn == "X":
            self.current_turn = "O"
        else:
            self.current_turn = "X"

if _name_ == "_main_":
    room = GameRoom()
    print(f"Scores: {room.score}")
    room.switch_turn()
    print(f"Current turn after switch: {room.current_turn}")
