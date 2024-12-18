DIFICULTIES = {
	{
		name = "Easy",
		board = 9,
		bombs = 10,
	},
	{
		name = "Intermediate",
		board = 16,
		bombs = 40,
	},
	{
		name = "Expert",
		board = 30,
		bombs = 99,
	},
	{
		name = "God",
		board = 100,
		bombs = 727,
	},
}

return {
	init_stuff = function()
		ICON_IMG = love.graphics.newImage("src/icon.png", nil)
		-- BOMB_IMG = love.graphics.newImage("src/bomb.png", nil)
		-- FLAG_IMG = love.graphics.newImage("src/flag.png", nil)
		-- SMILE_IMG = love.graphics.newImage("src/smile.png", nil)

		FONT = love.graphics.newFont("src/DaysOne-Regular.ttf")

		WIN_COLOR = { love.math.colorFromBytes(0, 0, 0) }
		LOOSE_COLOR = { love.math.colorFromBytes(0, 0, 0) }

		BAR_HEIGHT = 64
		BAR_COLOR = { love.math.colorFromBytes(209, 209, 209) }
		DROPDOWN_SELECTED = { love.math.colorFromBytes(100, 100, 100) }
		DROPDOWN_ITEM = { love.math.colorFromBytes(150, 150, 150) }
		FLAG_COLOR = { love.math.colorFromBytes(255, 0, 0) } -- #ff0000
		BOMB_COLOR = { love.math.colorFromBytes(0, 0, 0) } -- #000000
		BOMB_EXPLODED_COLOR = { love.math.colorFromBytes(255, 255, 0) } -- #ffff00

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
	end,
}
