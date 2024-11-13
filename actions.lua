require("globals")
local board = require("board")

local function revealCell(y, x)
	if BOARD[y][x].is_revealed then
		return
	end
	REVEALED_COUNT = REVEALED_COUNT + 1
	BOARD[y][x].is_revealed = true
	if BOARD[y][x].is_flagged then
		BOARD[y][x].is_flagged = false
		FLAG_COUNT = FLAG_COUNT - 1
	end
end

local function toggleFlag(y, x)
	if not PLAYING then
		return
	end
	if BOARD[y][x].is_revealed then
		return
	end
	if BOARD[y][x].is_flagged then
		BOARD[y][x].is_flagged = false
		FLAG_COUNT = FLAG_COUNT - 1
	else
		BOARD[y][x].is_flagged = true
		FLAG_COUNT = FLAG_COUNT + 1
	end
end

local function revealNeighbors(y, x)
	for h = y - 1, y + 1, 1 do
		if h > 0 and h <= BOARD_SIZE then
			for w = x - 1, x + 1, 1 do
				if w > 0 and w <= BOARD_SIZE then
					if not BOARD[h][w].is_revealed then
						revealCell(h, w)
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
						revealCell(h, w)
						if BOARD[h][w].value == 9 then
							BOARD[h][w].is_exploded = true
							DEAD = true
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

local function clickCell(y, x)
	if not PLAYING then
		PLAYING = true
		board.placeBombs(BOARD[y][x])
	end
	revealCell(y, x)
	if BOARD[y][x].value == 9 then
		BOARD[y][x].is_exploded = true
		DEAD = true
	elseif BOARD[y][x].value == 0 then
		revealNeighbors(y, x)
	end
end

return {
	clickCell = clickCell,
	clickAroundCell = clickAroundCell,
	toggleFlag = toggleFlag,
	revealCell = revealCell,
}
