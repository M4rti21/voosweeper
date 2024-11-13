local function drawCenteredText(text, rectX, rectY, rectWidth, rectHeight)
	local font = love.graphics.getFont()
	local textWidth = font:getWidth(text)
	local textHeight = font:getHeight()
	love.graphics.print(text, rectX + rectWidth / 2, rectY + rectHeight / 2, 0, 1, 1, textWidth / 2, textHeight / 2)
end

local function tableLength(T)
	local count = 0
	for _ in pairs(T) do
		count = count + 1
	end
	return count
end

return {
	drawCenteredText = drawCenteredText,
	tableLeingth = tableLength,
}
