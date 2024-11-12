local game = require("game")
local actions = require("actions")
local board = require("board")

local function mouseOverBoard(y, x)
	local y_board = y > BAR_HEIGHT and y < BOARD_PX + BAR_HEIGHT
	local x_board = x < BOARD_PX and x > 0
	y = math.ceil((y - BAR_HEIGHT) / CELL_SIZE)
	x = math.ceil(x / CELL_SIZE)
	return { y_board and x_board, y, x }
end

local function mouseOverReset(y, x)
	local x_center = BOARD_PX / 2
	local y_center = BAR_HEIGHT / 2
	local reset_radius = 15

	local y_reset = y > y_center - reset_radius / 2 and y < y_center + reset_radius / 2
	local x_reset = x > x_center - reset_radius / 2 and x < x_center + reset_radius / 2
	return y_reset and x_reset
end

local function handleLeftClick(y, x)
	local m = mouseOverBoard(y, x)
	if m[1] then
		if DEAD then
			return
		end
		if BOARD[m[2]][m[3]].is_flagged then
			actions.toggleFlag(m[2], m[3])
			return
		end
		print(m[1], m[2], m[3])
		actions.clickCell(m[2], m[3])
		return
	end
	local r = mouseOverReset(y, x)
	if r then
		game.startGame()
		return
	end
	-- x_center, y_center, 15
end

local function handleRightClick(y, x)
	local m = mouseOverBoard(y, x)
	if m[1] then
		if not PLAYING and DEAD then
			return
		end
		actions.toggleFlag(m[2], m[3])
		return
	end
end

local function handleMiddleClick(y, x)
	local m = mouseOverBoard(y, x)
	if m[1] then
		if not PLAYING and DEAD then
			return
		end
		if BOARD[m[2]][m[3]].is_flagged then
			actions.toggleFlag(m[2], m[3])
			return
		end
		local flags = board.flagsAroundCell(m[2], m[3])
		if flags == BOARD[m[2]][m[3]].value then
			actions.clickAroundCell(m[2], m[3])
		end
		return
	end
end

local function handleMouse(x, y, btn)
	if btn == 1 then
		handleLeftClick(y, x)
	elseif btn == 2 then
		handleRightClick(y, x)
	elseif btn == 3 then
		handleMiddleClick(y, x)
	else
		MOUSE_DOWN = false
	end
end

return {
	handleMouse = handleMouse,
}
