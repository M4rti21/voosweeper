require("globals")
local actions = require("actions")
local board = require("board")

MOUSE_DOWN = false

local function mouseOverBoard(y, x)
	print(y, x)
	local y_board = y <= (BOARD_SIZE * CELL_SIZE) and y > 0
	local x_board = x <= (BOARD_SIZE * CELL_SIZE) and x > 0
	return y_board and x_board
end

local function handleLeftClick(y, x)
	if mouseOverBoard(y, x) then
		y = math.ceil(y / CELL_SIZE)
		x = math.ceil(x / CELL_SIZE)
		actions.clickCell(y, x)
	end
end

local function handleRightClick(y, x)
	if mouseOverBoard(y, x) then
		y = math.ceil(y / CELL_SIZE)
		x = math.ceil(x / CELL_SIZE)
		actions.toggleFlag(y, x)
	end
end

local function handleMiddleClick(y, x)
	if not PLAYING then
		return
	end
	if mouseOverBoard(y, x) then
		x = math.ceil(x / CELL_SIZE)
		y = math.ceil(y / CELL_SIZE)
		local flags = board.flagsAroundCell(y, x)
		if flags == BOARD[y][x].value then
			actions.clickAroundCell(y, x)
		end
	end
end

local function handleMouse()
	local mx, my = love.mouse.getPosition()
	if love.mouse.isDown(1) then
		if MOUSE_DOWN then
			return
		end
		MOUSE_DOWN = true
		handleLeftClick(my, mx)
	elseif love.mouse.isDown(2) then
		if MOUSE_DOWN then
			return
		end
		MOUSE_DOWN = true
		handleRightClick(my, mx)
	elseif love.mouse.isDown(3) then
		if MOUSE_DOWN then
			return
		end
		MOUSE_DOWN = true
		handleMiddleClick(my, mx)
	else
		MOUSE_DOWN = false
	end
end

return {
	handleMouse = handleMouse,
}
