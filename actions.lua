require("globals")
local board = require("board")

local function revealNeighbors(y, x)
	for h = y - 1, y + 1, 1 do
		if h > 0 and h <= BOARD_SIZE then
			for w = x - 1, x + 1, 1 do
				if w > 0 and w <= BOARD_SIZE then
					if not BOARD[h][w].is_revealed then
						if BOARD[h][w].value < 9 then
							BOARD[h][w].is_revealed = true
						end
						if BOARD[h][w].value == 0 then
							revealNeighbors(h, w)
						end
					end
				end
			end
		end
	end
end

local function clickAroundCell(y, x)
	local flags = 0
	for h = y - 1, y + 1, 1 do
		if h > 0 and h <= BOARD_SIZE then
			for w = x - 1, x + 1, 1 do
				if w > 0 and w <= BOARD_SIZE then
					if not BOARD[h][w].is_revealed and not BOARD[h][w].is_flagged then
						if BOARD[h][w].value <= 9 then
							BOARD[h][w].is_revealed = true
						end
						if BOARD[h][w].value == 9 then
							BOARD[h][w].is_exploded = true
						end
						if BOARD[h][w].value == 0 then
							revealNeighbors(h, w)
						end
					end
				end
			end
		end
	end
	return flags
end

local function toggleFlag(y, x)
	if not PLAYING then
		return
	end
	BOARD[y][x].is_flagged = not BOARD[y][x].is_flagged
end

local function clickCell(y, x)
	print(y, x)
	if not PLAYING then
		PLAYING = true
		board.placeBombs(BOARD[y][x])
	end
	BOARD[y][x].is_revealed = true
	revealNeighbors(y, x)
end

return {
	clickCell = clickCell,
	clickAroundCell = clickAroundCell,
	toggleFlag = toggleFlag,
}
