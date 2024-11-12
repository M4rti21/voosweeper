local globals = require("globals")
local board = require("board")

local function startGame()
	globals.init_game()
	board.createBoard()
end

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

return {
	msg = msg,
	startGame = startGame,
	updateClock = updateClock,
	checkIfLost = checkIfLost,
	checkIfWin = checkIfWin,
}
