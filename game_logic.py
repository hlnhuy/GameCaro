BOARD_SIZE = 15

def create_board():
    """Khởi tạo bàn cờ trống với kích thước BOARD_SIZE x BOARD_SIZE."""
    return [[None]*BOARD_SIZE for _ in range(BOARD_SIZE)]

def check_win(board, x, y):
    directions = [(1, 0), (0, 1), (1, 1), (1, -1)]
    player = board[x][y]
    if player is None: return False

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
    if 0 <= x < BOARD_SIZE and 0 <= y < BOARD_SIZE and board[x][y] is None:
        board[x][y] = player
        return True
    return False

def main():
    board = create_board()
    current_player = "X"
    game_over = False
    print("--- GOMOKU ENGINE READY ---")
    moves = [(7,7), (7,8), (7,9), (7,10), (7,11)]
    
    for x, y in moves:
        if place_piece(board, x, y, current_player):
            print(f"Player {current_player} placed at ({x}, {y})")
            if check_win(board, x, y):
                print(f"GAME OVER! Player {current_player} wins!")
                game_over = True
                break
    print(f"Check final piece: {board[7][11]}") 

if __name__ == "__main__":
    main()