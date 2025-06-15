############## WHITE(minimax) STARTS, RL IS BLACK ##############
import numpy as np
import pygame
from copy import deepcopy
import random
import json

learning_rate = 0.4
discount_rate = 0.85
Q_table1 = dict()
Q_table2 = dict()

SIZE = 800
ROW, COL = 8, 8
SQUARE_SIZE = SIZE // ROW
SPACE = 20
DEPTH = 5
black = ['B', '', 'B', '', 'B', '', 'B', '', 'B']
empty = ['', '', '', '', '', '', '', '']
white = ['', 'W', '', 'W', '', 'W', '', 'W', '']
opp = {'W': ['B', 'P'], 'B': ['W', 'Y'], 'Y': ['B', 'P'], 'P': ['W', 'Y']}
color = {'W': "white", 'B': "red", 'Y': "yellow", 'P': "purple"}
WHITE_COUNT, BLACK_COUNT = 0, 0
WHITE_STARTS = [[[],[],[],[],[],[],[],[]], [[],[],[],[],[],[],[],[]], [[], [], [], [], [], [], [], []], [[],[],[],[],[],[],[],[]], [[],[],[],[],[],[],[],[]], [[], [(4,0),(4,2)], [], [(4,2),(4,4)], [], [(4,4),(4,6)], [], [(4,6)]] , [[],[],[],[],[],[],[],[]], [[],[],[],[],[],[],[],[]]]
pygame.init()



with open("rl_vs_rl5.json", 'r') as file:
    Q_table1 =  json.load(file)
with open("rl_vs_rl6.json", 'r') as file:
    Q_table2 = json.load(file)


def board_to_str(state):
    str_state = ''
    for row in range(8):
        for col in range(8):
            if state[row][col] == '':
                str_state += ' '
            else:
                str_state += state[row][col]
    return str_state


def evaluate_reward(board, current_player, killed):
    reward = 0
    if killed : reward += 1
    return reward



def update_possible_moves (board, killed, current_player):
    current_color, mandatory = board[current_player[0]][current_player[1]], set()

    def can_go_to(row, col):
        can_goto = []
        piece_color = board[row][col]
        if piece_color != 'W':
            if col < 7 and row < 7 and board[row + 1][col + 1] == '':
                can_goto.append((row + 1, col + 1))
            elif col < 6 and row < 6 and (board[row + 1][col + 1] in opp[board[row][col]]) and board[row + 2][col + 2] == '':
                can_goto.append((row + 2, col + 2))
                mandatory.add((row,col))
            if col > 0 and row < 7 and board[row + 1][col - 1] == '':
               can_goto.append((row + 1, col - 1))
            elif col > 1 and row < 6 and (board[row + 1][col - 1] in opp[board[row][col]]) and board[row + 2][col - 2] == '':
                can_goto.append((row + 2, col - 2))
                mandatory.add((row,col))

        if piece_color != 'B':
            if col < 7 and row > 0 and board[row - 1][col + 1] == '':
                can_goto.append((row - 1, col + 1))
            elif col < 6 and row > 1 and (board[row - 1][col + 1] in opp[board[row][col]]) and board[row - 2][col + 2] == '':
                can_goto.append((row - 2, col + 2))
                mandatory.add((row,col))
            if col > 0 and row > 0 and board[row - 1][col - 1] == '':
                can_goto.append((row - 1, col - 1))
            elif col > 1 and row > 1 and (board[row - 1][col - 1] in opp[board[row][col]]) and board[row - 2][col - 2] == '':
                can_goto.append((row - 2, col - 2))
                mandatory.add((row,col))
        return can_goto

    can_goto_list, zigzag, game_over = [], False, False
    # if zigzag possible, current players can goto positions
    if killed:
        current_cangoto = can_go_to(current_player[0], current_player[1])
        if len(mandatory) != 0:
            zigzag = True
            for row in range(8):
                can_goto_list.append([])
                for col in range(8):
                    can_goto_list[row].append([])
                    if row == current_player[0] and col == current_player[1]:
                        can_goto_list[row][col] = (current_cangoto)
    # if zigzag not possible, next colors can goto positions
    if (not killed) or len(mandatory) == 0:
        for row in range(0, 8):
            can_goto_list.append([])
            for col in range(0, 8):
                can_goto_list[row].append([])
                if board[row][col] in opp[current_color]:
                    can_goto_list[row][col] = can_go_to(row, col)
        if len(mandatory) != 0:
            killed = False
            for row in range(0, 8):
                for col in range(0, 8):
                    if (row, col) not in mandatory:
                        can_goto_list[row][col] = []
                    else:
                        pos1, remove = (row, col), set()
                        for pos2 in can_goto_list[row][col]:
                            if abs(pos1[0] - pos2[0]) != 2 or abs(pos1[1] - pos2[1]) != 2:
                                remove.add(pos2)
                        for pos2 in remove:
                            (can_goto_list[row][col]).remove(pos2)
    cannot_go_anywhere = len([True for ele in can_goto_list if ele == [[],[],[],[],[],[],[],[]]]) == 8
    if ('W' not in board and 'Y' not in board) or ('B' not in board and 'P' not in board) or cannot_go_anywhere:
        game_over = True
    return can_goto_list, zigzag, killed, game_over



def valid_moves(board, killed, current_player):
    valid_moves = []
    can_goto_list, zigzag, killed, game_over = update_possible_moves(board, killed, current_player)
    for row in range(8):
        for col in range(8):
            if len(can_goto_list[row][col]) != 0:
                for pos2 in can_goto_list[row][col]:
                    valid_moves.append(str(row) + str(col) + str(pos2[0]) + str(pos2[1]))
    return valid_moves



def move_in_board (board, pos1, pos2):
    current_color = board[pos1[0]][pos1[1]]
    killed = False
    def swap(pos1, pos2):
        if pos2[0] in (0, 7) and current_color == 'W':
            board[pos1[0], pos1[1]] = 'Y'
        elif pos2[0] in (0, 7) and current_color == 'B':
            board[pos1[0], pos1[1]] = 'P'
        board[pos2[0]][pos2[1]], board[pos1[0]][pos1[1]] = board[pos1[0]][pos1[1]], ''
    if abs(pos1[0] - pos2[0]) == 1 and abs(pos1[1] - pos2[1]) == 1:
        killed = False
        swap(pos1, pos2)
    elif abs(pos1[0] - pos2[0]) == 2 and abs(pos1[1] - pos2[1]) == 2:
        killed = True
        swap(pos1, pos2)
        board[(pos1[0] + pos2[0]) // 2][(pos1[1] + pos2[1]) // 2] = ''
    return board, killed

########################################################################################################################################

class checkers:

    def __init__(self):
        self.running = True
        self.screen = pygame.display.set_mode((SIZE, SIZE))
        self.clock = pygame.time.Clock()
        self.board = np.array([black[:-1], black[1:], black[:-1],empty, empty, white[:-1], white[1:], white[:-1]])
        self.can_goto = WHITE_STARTS
        self.current_player = (0, 0)
        self.current_color = 'W'
        self.killed = False
        self.zigzag = False
        self.all_moves1, self.all_moves2 = [], []
        self.epsilon = 1
        self.init_graphics()



    def init_graphics(self):
        for row in range(0, 8):
            for col in range(0, 8):
                if (row + col) % 2 == 1:
                    pygame.draw.rect(self.screen, "white", (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
                else:
                    self.paint_green((row, col))
                    if self.board[row][col] == 'W':
                        pygame.draw.circle(self.screen, "white",((col * SQUARE_SIZE) + SQUARE_SIZE // 2, (row * SQUARE_SIZE + SQUARE_SIZE // 2)), SQUARE_SIZE // 2 - SPACE)
                    elif self.board[row][col] == 'B':
                        pygame.draw.circle(self.screen, "red",((col * SQUARE_SIZE) + SQUARE_SIZE // 2, (row * SQUARE_SIZE + SQUARE_SIZE // 2)), SQUARE_SIZE // 2 - SPACE)
   


    def paint_green(self, pos):
        pygame.draw.rect(self.screen, "green", (pos[1] * SQUARE_SIZE, pos[0] * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))



    def update_graphics(self, pos1, pos2):
        self.paint_green(pos1)
        pygame.draw.circle(self.screen, color[self.board[pos2[0]][pos2[1]]], ((pos2[1] * SQUARE_SIZE) + SQUARE_SIZE // 2, (pos2[0] * SQUARE_SIZE + SQUARE_SIZE // 2)), SQUARE_SIZE // 2 - SPACE)
        if self.killed:
            self.paint_green( ((pos1[0] + pos2[0]) // 2, (pos1[1] + pos2[1]) // 2) )




    def move (self, pos1, pos2):
        global WHITE_COUNT
        global BLACK_COUNT
        #print (pos1, pos2)
        if pos1 != None and pos2 in self.can_goto[pos1[0]][pos1[1]]:
            self.current_color = self.board[pos1[0]][pos1[1]]
            self.board, self.killed = move_in_board(self.board, pos1, pos2)
            #self.update_graphics(pos1, pos2)
            self.current_player = pos2
            self.can_goto, self.zigzag, self.killed, game_over = update_possible_moves(self.board, self.killed, self.current_player)
            if game_over:
                self.running = False
                if self.current_color in ('B', 'P'): BLACK_COUNT += 1
                else                               : WHITE_COUNT += 1
                    #print (f"GAME WON BY : {self.current_color}")




    def choose_action(self, state, turn):
        str_state, max_q, best_action = board_to_str(state), -10000, 0
        if turn % 2 == 0: 
            if np.random.rand() < self.epsilon or str_state not in Q_table1.keys():
                return  random.choice(valid_moves(state, self.killed, self.current_player))
            else:
                for move in Q_table1[str_state].keys():
                    if Q_table1[str_state][move] >= max_q:
                        max_q = Q_table1[str_state][move]
                        best_action = move
        else:
            if np.random.rand() < self.epsilon or str_state not in Q_table2.keys():
                return  random.choice(valid_moves(state, self.killed, self.current_player))
            else:
                for move in Q_table2[str_state].keys():
                    if Q_table2[str_state][move] >= max_q:
                        max_q = Q_table2[str_state][move]
                        best_action = move
        return best_action


    def learn(self, current_state, str_current_state, action, reward, str_next_state, turn):
        if turn % 2 == 0:
            if str_current_state not in Q_table1.keys() or action not in Q_table1[str_current_state]:
                Q_table1[str_current_state] = dict()
                for action in valid_moves(deepcopy(current_state), deepcopy(self.killed), deepcopy(self.current_player)):
                    Q_table1[str_current_state][action] = 0
            next_best_score = 0
            if str_next_state in Q_table1:
                for act in Q_table1[str_next_state]:
                    next_best_score = max(Q_table1[str_next_state][act], next_best_score)
            Q_table1[str_current_state][action] += (learning_rate * (reward + discount_rate * next_best_score - Q_table1[str_current_state][action]))
        else:
            if str_current_state not in Q_table2.keys() or action not in Q_table2[str_current_state]:
                Q_table2[str_current_state] = dict()
                for action in valid_moves(deepcopy(current_state), deepcopy(self.killed), deepcopy(self.current_player)):
                    Q_table2[str_current_state][action] = 0
            next_best_score = 0
            if str_next_state in Q_table2:
                for act in Q_table2[str_next_state]:
                    next_best_score = max(Q_table2[str_next_state][act], next_best_score)
            Q_table2[str_current_state][action] += (learning_rate * (reward + discount_rate * next_best_score - Q_table2[str_current_state][action]))



    def rl_play(self, turn):
        if len(valid_moves(deepcopy(self.board), self.killed, self.current_player)) == 0:
            return
        str_state = board_to_str(deepcopy(self.board))
        action = self.choose_action(deepcopy(self.board), turn)
        action_tup = ((int(action[0]), int(action[1])), (int(action[2]), int(action[3])))

        next_state, killed = move_in_board(deepcopy(self.board), action_tup[0], action_tup[1])
        str_next_state = board_to_str(next_state)

        reward = evaluate_reward(next_state, action_tup[0], killed)
        self.learn(deepcopy(self.board), deepcopy(str_state), action, reward, str_next_state, turn)

        self.current_player = action_tup[0]
        self.move(action_tup[0], action_tup[1])
        if turn % 2 == 0 : self.all_moves1.append((deepcopy(str_state), action))
        else             : self.all_moves2.append((deepcopy(str_state), action))

        if self.zigzag and self.running:
            self.rl_play(turn)



def train_RL():
    epsilon = 0
    for ep in range(100):
        if ep % 2000 == 0:
            print ("Episode no. : ", ep)
            #if epsilon > 0.1: epsilon -= 0.1
            #if epsilon * 100 < 5 : epsilon = 0.05
            print ("Epsilon = ", epsilon)

        game = checkers()
        game.epsilon, turn = epsilon, 0
        while turn < 120 and game.running:
            game.rl_play(turn)
            turn += 1
            
        game_end_reward = 0
        str_board = board_to_str(game.board)
        if str_board.count('W') <= str_board.count('B') : game_end_reward = 15
        else                                            : game_end_reward = -15
        for state, action in game.all_moves1:
            if action in Q_table1[state].keys():
                Q_table1[state][action] -= game_end_reward
        for state, action in game.all_moves2:
            if action in Q_table2[state].keys():
                Q_table2[state][action] += game_end_reward
    print ("WHITES  = ", WHITE_COUNT)
    print ("REDS    = ", BLACK_COUNT)




# BOT TRAINING :
train_RL()


with open("rl_vs_rl5.json", 'w') as file:
    json.dump(Q_table1, file)
with open("rl_vs_rl6.json", 'w') as file:
    json.dump(Q_table2, file)


print ("########### RL VS RL : 10000 episodes (Black: 1, White: 2) ###############")

'''
1 is Black and 2 is White
'''


