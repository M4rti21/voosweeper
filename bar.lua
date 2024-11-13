local utils = require("utils")
local game = require("game")
DROPDOWN_OPEN = false

local dropdown_height = 25
local dropdown_width = 200
local text_padding = 5
local top_offset = 32 - dropdown_height / 2
local left_offset = 5

local function drawDropdown()
	love.graphics.setColor(DROPDOWN_SELECTED)
	love.graphics.rectangle("fill", left_offset, top_offset, dropdown_width, dropdown_height)
	love.graphics.setColor(0, 0, 0)
	love.graphics.printf(
		"Diff: " .. DIFICULTIES[CURRENT_DIFF].name,
		left_offset + text_padding,
		top_offset + text_padding,
		dropdown_width - (text_padding * 2),
		"left"
	)

	if not DROPDOWN_OPEN then
		return
	end

	local item_y_offset = top_offset + dropdown_height
	for i in pairs(DIFICULTIES) do
		love.graphics.setColor(DROPDOWN_ITEM)
		love.graphics.rectangle("fill", left_offset, item_y_offset, dropdown_width, dropdown_height)
		love.graphics.setColor(0, 0, 0)
		love.graphics.printf(
			DIFICULTIES[i].name,
			left_offset + text_padding,
			item_y_offset + text_padding,
			dropdown_width - (text_padding * 2),
			"left"
		)
		item_y_offset = item_y_offset + dropdown_height
	end
end

local function drawButtons()
	local x_center = BOARD_PX / 2
	local y_center = BAR_HEIGHT / 2

	local y_offset = 6
	local center_offset = 40
	local text_width = 100
	love.graphics.setColor(BOMB_EXPLODED_COLOR)
	love.graphics.circle("fill", x_center, y_center, 15)
	love.graphics.setColor(0, 0, 0)
	love.graphics.printf(
		"Time: " .. math.floor(ELAPSED_TIME),
		x_center + center_offset,
		y_center - (y_offset * 2),
		text_width,
		"left"
	)
	love.graphics.printf(
		"Bombs: " .. FLAG_COUNT .. "/" .. BOMB_COUNT,
		x_center + center_offset,
		y_center,
		text_width,
		"left"
	)
end

local function clickDropdown(y, _)
	print("clickDropdown")
	y = y - top_offset

	local index = 0
	for i = 0, utils.tableLeingth(DIFICULTIES) do
		if y < dropdown_height then
			index = i
			break
		else
			y = y - dropdown_height
		end
	end

	if index > 0 then
		game.startGame(index)
	end

	DROPDOWN_OPEN = not DROPDOWN_OPEN
end

local function drawBar()
	love.graphics.setColor(BAR_COLOR)
	love.graphics.rectangle("fill", 0, 0, BOARD_PX, BAR_HEIGHT)

	drawDropdown()
	drawButtons()
end

return {
	drawBar = drawBar,
	clickDropdown = clickDropdown,
	-- getters
	getDropdownBox = function()
		local x2 = left_offset + dropdown_width
		local y2 = top_offset + dropdown_height

		if DROPDOWN_OPEN then
			y2 = y2 + utils.tableLeingth(DIFICULTIES) * dropdown_height
		end

		return {
			x1 = left_offset,
			y1 = top_offset,
			x2 = x2,
			y2 = y2,
		}
	end,
}
