BOARD_SIZE = 15

def create_board():
    return [[None]*BOARD_SIZE for _ in range(BOARD_SIZE)]

def check_win(board, x, y):
    directions = [(1, 0), (0, 1), (1, 1), (1, -1)]
    player = board[x][y]

    for dx, dy in directions:
        count = 1
        for step in [1, -1]:
            nx, ny = x, y
            while True:
                nx += dx * step
                ny += dy * step
                if 0 <= nx < BOARD_SIZE and 0 <= ny < BOARD_SIZE and board[nx][ny] == player:
                    count += 1
                else:
                    break
        if count >= 5:
            return True
    return False

def place_piece(board, x, y, player):
    if not (0 <= x < BOARD_SIZE and 0 <= y < BOARD_SIZE):
        print(f"Lỗi: Tọa độ ({x}, {y}) nằm ngoài bàn cờ!")
        return False
    if board[x][y] is not None:
        print(f"Lỗi: Ô ({x}, {y}) đã có quân cờ rồi!")
        return False
    board[x][y] = player
    return True

if __name__ == "__main__":
    board = create_board()
    place_piece(board, 7, 7, "Black")
    place_piece(board, 7, 7, "White")
    place_piece(board, 20, 20, "Black")
    print("Trạng thái ô (7,7):", board[7,7])