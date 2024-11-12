require("globals")
local utils = require("utils")

local function createBoard()
	BOARD = {}
	for y = 1, BOARD_SIZE, 1 do
		table.insert(BOARD, {})
		for x = 1, BOARD_SIZE, 1 do
			table.insert(BOARD[y], {
				y = y,
				x = x,
				value = 0,
				is_bomb = false,
				is_exploded = false,
				is_flagged = false,
				is_revealed = false,
				is_disabled = false,
			})
		end
	end
end

local function placeNumbers(y, x)
	local cell = BOARD[y][x]
	if cell.is_bomb then
		return
	end
	local count = 0
	for h = y - 1, y + 1, 1 do
		if h > 0 and h <= BOARD_SIZE then
			for w = x - 1, x + 1, 1 do
				if w > 0 and w <= BOARD_SIZE then
					if BOARD[h][w].is_bomb then
						count = count + 1
					end
				end
			end
		end
		cell.value = count
	end
end

local function flagsAroundCell(y, x)
	local flags = 0
	for h = y - 1, y + 1, 1 do
		if h > 0 and h <= BOARD_SIZE then
			for w = x - 1, x + 1, 1 do
				if w > 0 and w <= BOARD_SIZE then
					if BOARD[h][w].is_flagged then
						flags = flags + 1
					end
				end
			end
		end
	end
	return flags
end

local function placeBombs(start_tile)
	local placed_bomb_count = 0
	while placed_bomb_count < BOMB_COUNT do
		local iterate = function()
			local rand_y = love.math.random(1, BOARD_SIZE)
			local rand_x = love.math.random(1, BOARD_SIZE)
			local cell = BOARD[rand_y][rand_x]
			if cell.is_bomb then
				return
			elseif rand_y == start_tile.y and rand_x == start_tile.x then
				return
			elseif rand_y == start_tile.y - 1 and rand_x == start_tile.x then
				return
			elseif rand_y == start_tile.y + 1 and rand_x == start_tile.x then
				return
			elseif rand_y == start_tile.y and rand_x == start_tile.x + 1 then
				return
			elseif rand_y == start_tile.y and rand_x == start_tile.x - 1 then
				return
			elseif rand_y == start_tile.y - 1 and rand_x == start_tile.x - 1 then
				return
			elseif rand_y == start_tile.y + 1 and rand_x == start_tile.x + 1 then
				return
			elseif rand_y == start_tile.y + 1 and rand_x == start_tile.x - 1 then
				return
			elseif rand_y == start_tile.y - 1 and rand_x == start_tile.x + 1 then
				return
			end
			cell.value = 9
			cell.is_bomb = true
			placed_bomb_count = placed_bomb_count + 1
		end
		iterate()
	end
	for y in pairs(BOARD) do
		for x in pairs(BOARD[y]) do
			placeNumbers(y, x)
		end
	end
end

local function drawBoard()
	love.graphics.setFont(FONT)
	for y in pairs(BOARD) do
		local y_offset = CELL_SIZE * (y - 1)
		for x in pairs(BOARD[y]) do
			local cell = BOARD[y][x]
			if (x + y) % 2 == 0 then
				if cell.is_revealed then
					love.graphics.setColor(COLORS_CELLS.reveal.evn)
				else
					love.graphics.setColor(COLORS_CELLS.hidden.evn)
				end
			else
				if cell.is_revealed then
					love.graphics.setColor(COLORS_CELLS.reveal.odd)
				else
					love.graphics.setColor(COLORS_CELLS.hidden.odd)
				end
			end
			local x_offset = CELL_SIZE * (x - 1)
			local quarter = CELL_SIZE / 4
			love.graphics.rectangle("fill", x_offset, y_offset, CELL_SIZE, CELL_SIZE)
			if cell.is_revealed then
				if cell.value > 0 and cell.value < 9 then
					love.graphics.setColor(COLORS_NUMBERS[cell.value + 1])
					utils.drawCenteredText(cell.value, x_offset, y_offset, CELL_SIZE, CELL_SIZE)
				elseif cell.value == 9 then
					if cell.is_exploded then
						love.graphics.setColor(BOMB_EXPLODED_COLOR)
					else
						love.graphics.setColor(BOMB_COLOR)
					end
					love.graphics.circle("fill", x_offset + (CELL_SIZE / 2), y_offset + (CELL_SIZE / 2), quarter)
				end
			elseif cell.is_flagged then
				love.graphics.setColor(FLAG_COLOR)
				love.graphics.circle("fill", x_offset + (CELL_SIZE / 2), y_offset + (CELL_SIZE / 2), quarter, 3)
			end
		end
	end
end

return {
	createBoard = createBoard,
	placeBombs = placeBombs,
	placeNumbers = placeNumbers,
	drawBoard = drawBoard,
	flagsAroundCell = flagsAroundCell,
}
