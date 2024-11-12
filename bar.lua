require("globals")

local function drawBar()
	love.graphics.setColor(BAR_COLOR)
	love.graphics.rectangle("fill", 0, 0, BOARD_PX, BAR_HEIGHT)

	local x_center = BOARD_PX / 2
	local y_center = BAR_HEIGHT / 2

	local y_offset = 6
	local center_offset = 40
	local text_width = 100

	love.graphics.setColor(0, 0, 0)
	love.graphics.printf(
		"Time: " .. math.floor(ELAPSED_TIME),
		x_center - center_offset - text_width,
		y_center - y_offset,
		text_width,
		"right"
	)
	love.graphics.setColor(BOMB_EXPLODED_COLOR)
	love.graphics.circle("fill", x_center, y_center, 15)
	love.graphics.setColor(0, 0, 0)
	love.graphics.printf(
		"Bombs: " .. FLAG_COUNT .. "/" .. BOMB_COUNT,
		x_center + center_offset,
		y_center - y_offset,
		text_width,
		"left"
	)
end

return {
	drawBar = drawBar,
}
