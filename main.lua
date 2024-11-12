local globals = require("globals")
local board = require("board")
local mouse = require("mouse")
local game = require("game")

function love.load()
	love.window.setTitle("Voosweeper")
	love.window.setMode(640, 640)
	globals.init()
	board.createBoard() -- omg im dumb
end

function love.draw()
	board.drawBoard()
end

function love.update()
	game.checkIfWin()
	game.checkIfLost()
	mouse.handleMouse()
end
