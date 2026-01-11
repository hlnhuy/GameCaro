BOARD_SIZE = 15

def create_board():
    return [[None]*BOARD_SIZE for _ in range(BOARD_SIZE)]

def check_win(board, x, y):
    
    directions = [(1,0), (0,1)] 
    player = board[x][y]

    for dx, dy in directions:
        count = 1
        
        nx, ny = x + dx, y + dy
       
        while board[nx][ny] == player: 
            count += 1
            nx += dx
            ny += dy
        
        if count == 5:
            return True
    return False
if __name__ == "__main__":
    game_board = create_board()
    # Giả lập đánh 5 quân hàng ngang sát mép
    for i in range(5):
        game_board[0][i] = "X"
    
    if check_win(game_board, 0, 4):
        print("Player X wins!")
    else:
        print("No winner yet.")