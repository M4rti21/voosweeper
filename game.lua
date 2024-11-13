local board = require("board")

local function checkIfLost()
	return DEAD
end

local function checkIfWin()
	return REVEALED_COUNT == CELL_COUNT - BOMB_COUNT
end

local function msg(text, color)
	love.graphics.setColor(color)
	love.graphics.printf(text, BOARD_PX / 2, BOARD_PX / 2 + BAR_HEIGHT, BOARD_PX / 2, "center")
end

local function updateClock(dt)
	if not PLAYING then
		return
	end
	ELAPSED_TIME = ELAPSED_TIME + dt
end

local function startGame(diff_index)
	print("game started with diff", diff_index)
	CURRENT_DIFF = diff_index
	BOARD = {}
	BOARD_SIZE = DIFICULTIES[diff_index].board
	BOMB_COUNT = DIFICULTIES[diff_index].bombs
	FLAG_COUNT = 0

	CELL_SIZE = 32
	BOARD_PX = BOARD_SIZE * CELL_SIZE

	CELL_COUNT = BOARD_SIZE * BOARD_SIZE
	REVEALED_COUNT = 0
	ELAPSED_TIME = 0

	PLAYING = false
	DEAD = false

	love.window.setMode(BOARD_PX, BOARD_PX + BAR_HEIGHT)

	board.createBoard()
end

return {
	msg = msg,
	startGame = startGame,
	updateClock = updateClock,
	checkIfLost = checkIfLost,
	checkIfWin = checkIfWin,
}
