BOARD_SIZE = 15

def create_board():
    return [[None for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]

def check_win(board, x, y):
    player = board[x][y]
    directions = [(1,0), (0,1), (1,1), (1,-1)]

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
