local globals = require("globals")
local bar = require("bar")
local board = require("board")
local mouse = require("mouse")
local game = require("game")

function love.load()
	globals.init_stuff()
	game.startGame(1)
	love.window.setTitle("Voosweeper")
	-- love.window.setIcon(ICON_IMG:getData())
end

function love.draw()
	board.drawBoard()
	bar.drawBar()
end

function love.update(dt)
	game.updateClock(dt)
	if game.checkIfLost() then
		PLAYING = false
		board.revealBombs()
		game.msg("You lost!", LOOSE_COLOR)
	elseif game.checkIfWin() then
		PLAYING = false
		game.msg("You won!", WIN_COLOR)
	end
end

function love.mousereleased(x, y, btn)
	mouse.handleMouse(x, y, btn)
end
