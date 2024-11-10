CELL_SIZE = 32
BOARD_SIZE = 20
BOMB_COUNT = 50

BOARD = {}
PLAYING = false

function love.load()
	love.window.setTitle("Voosweeper")
	BOMB_IMG = love.graphics.newImage("src/bomb.png", nil)
	FLAG_IMG = love.graphics.newImage("src/flag.png", nil)
	FONT = love.graphics.newFont("src/DaysOne-Regular.ttf")
	COLORS_NUMBERS = {
		{ 0, 0, 0 }, -- "#000000", // Empty
		{ love.math.colorFromBytes(55, 47, 189) }, -- "#372fbd", // 1
		{ love.math.colorFromBytes(91, 166, 70) }, -- "#5ba646", // 2
		{ love.math.colorFromBytes(197, 53, 35) }, -- "#c53523", // 3
		{ love.math.colorFromBytes(112, 60, 117) }, -- "#703c75", // 4
		{ love.math.colorFromBytes(229, 132, 0) }, -- "#e58400", // 5
		{ love.math.colorFromBytes(29, 156, 134) }, -- "#1d9c86", // 6
		{ love.math.colorFromBytes(113, 85, 44) }, -- "#71552c", // 7
		{ love.math.colorFromBytes(43, 40, 36) }, -- "#2b2824", // 8
		{ love.math.colorFromBytes(0, 0, 0) }, -- "#000000", // 💣
	}
	COLORS_CELLS = {
		hidden = {
			evn = { love.math.colorFromBytes(249, 115, 194) }, -- #fa8bcd
			odd = { love.math.colorFromBytes(250, 139, 205) }, -- #f973c2
		},
		reveal = {
			evn = { love.math.colorFromBytes(208, 198, 177) }, -- #d0c6b1
			odd = { love.math.colorFromBytes(221, 221, 192) }, -- #ddd3c0
		},
	}
	CreateBoard()
end

function love.draw()
	DrawBoard()
end

function love.update()
	if love.mouse.isDown(1) then
		local mx, my = love.mouse.getPosition()
		if mx <= (BOARD_SIZE * CELL_SIZE) and mx <= (BOARD_SIZE * CELL_SIZE) then
			mx = math.ceil(mx / CELL_SIZE)
			my = math.ceil(my / CELL_SIZE)
			ClickCell(my, mx)
		end
	end
end

function ClickCell(y, x)
	if not PLAYING then
		PLAYING = true
		PlaceBombs(BOARD[y][x])
	end
	BOARD[y][x].is_revealed = true
	RevealNeighbors(y, x)
end

function RevealNeighbors(y, x)
	for h = y - 1, y + 1, 1 do
		if h > 0 and h <= BOARD_SIZE then
			for w = x - 1, x + 1, 1 do
				if w > 0 and w <= BOARD_SIZE then
					if not BOARD[h][w].is_revealed then
						if BOARD[h][w].value < 9 then
							BOARD[h][w].is_revealed = true
						end
						if BOARD[h][w].value == 0 then
							RevealNeighbors(h, w)
						end
					end
				end
			end
		end
	end
end

function CreateBoard()
	BOARD = {}
	for y = 1, BOARD_SIZE, 1 do
		table.insert(BOARD, {})
		for x = 1, BOARD_SIZE, 1 do
			table.insert(BOARD[y], {
				y = y,
				x = x,
				value = 0,
				is_bomb = false,
				is_flagged = false,
				is_revealed = false,
				is_disabled = false,
			})
		end
	end
end

function PlaceBombs(start_tile)
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
			PlaceNumbers(y, x)
		end
	end
end

function PlaceNumbers(y, x)
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

function DrawBoard()
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
					DrawCenteredText(cell.value, x_offset, y_offset, CELL_SIZE, CELL_SIZE)
				elseif cell.value == 9 then
					love.graphics.setColor(0, 0, 0)
					love.graphics.circle("fill", x_offset + (CELL_SIZE / 2), y_offset + (CELL_SIZE / 2), quarter)
				end
			end
		end
	end
end

function DrawCenteredText(text, rectX, rectY, rectWidth, rectHeight)
	print("pringing test")
	local font = love.graphics.getFont()
	local textWidth = font:getWidth(text)
	local textHeight = font:getHeight()
	love.graphics.print(text, rectX + rectWidth / 2, rectY + rectHeight / 2, 0, 1, 1, textWidth / 2, textHeight / 2)
end
