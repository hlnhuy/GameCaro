BOARD_SIZE = 15

def create_board():
    return [[None]*BOARD_SIZE for _ in range(BOARD_SIZE)]

def check_win(board, x, y):
    directions = [(1, 0), (0, 1), (1, 1), (1, -1)]
    player = board[x][y]

    for dx, dy in directions:
        count = 1 
        
        for step in [1, -1]:
            nx, ny = x + dx * step, y + dy * step
            
            while 0 <= nx < BOARD_SIZE and 0 <= ny < BOARD_SIZE and board[nx][ny] == player:
                count += 1
                nx += dx * step
                ny += dy * step
        if count >= 5:
            return True
            
    return False
if __name__ == "__main__":
    game_board = create_board()
    for i in range(5, 10):
        game_board[5][i] = "X"
    if check_win(game_board, 5, 7):
        print("Success: Win detected correctly from the middle!")
    else:
        print("Still has bug.")