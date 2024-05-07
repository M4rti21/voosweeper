import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Difficulty } from "./App";
import Cell from "./Cell";
import { BOMB_NUM } from "./constants";

type Props = {
    diff: Difficulty,
    dead: boolean,
    setDead: Dispatch<SetStateAction<boolean>>
    playing: boolean,
    setPlaying: Dispatch<SetStateAction<boolean>>
    setFlagCount: Dispatch<SetStateAction<number>>
}

export type Tile = {
    y: number;
    x: number;
    value: number;
    isBomb: boolean;
    isEmpty: boolean;
    isFlagged: boolean;
    isRevealed: boolean;
    isDisabled: boolean;
}

function Board({ diff, dead, setDead, playing, setPlaying, setFlagCount }: Props) {

    const [board, setBoard] = useState<Tile[][]>([]);

    useEffect(() => {
        if (!checkWin()) return;
        setPlaying(false);
    }, [board]);

    useEffect(() => {
        populateBoard();
    }, []);

    useEffect(() => {
        populateBoard();
    }, [diff]);

    function populateBoard() {
        setFlagCount(0);
        const newBoard: Tile[][] = [];
        for (let i = 0; i < diff.size; i++) {
            newBoard.push([]);
            for (let j = 0; j < diff.size; j++) {
                newBoard[i].push({
                    y: i, x: j,
                    value: 0,
                    isBomb: false,
                    isEmpty: true,
                    isFlagged: false,
                    isRevealed: false,
                    isDisabled: false,
                });
            }
        }
        let placedBombsCount = 0;
        while (placedBombsCount < diff.bombs) {
            const randY = Math.floor(Math.random() * diff.size);
            const randX = Math.floor(Math.random() * diff.size);
            if (newBoard[randY][randX].isBomb) continue;
            newBoard[randY][randX].value = BOMB_NUM;
            newBoard[randY][randX].isBomb = true;
            newBoard[randY][randX].isEmpty = false;
            placedBombsCount++;
        }
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard.length; j++) {
                findBombs(newBoard, i, j);
            }
        }
        setBoard(newBoard);
    }

    function findBombs(newBoard: Tile[][], y: number, x: number) {
        if (newBoard[y][x].isBomb) return;
        let count = 0;
        for (let h = y - 1; h <= y + 1; h++) {
            if (h < 0) continue;
            if (h >= newBoard.length) continue;
            for (let w = x - 1; w <= x + 1; w++) {
                if (w < 0) continue;
                if (w >= newBoard.length) continue;
                if (newBoard[h][w].isBomb) count++;
            }
        }
        if (count === 0) return;
        newBoard[y][x].value = count;
        newBoard[y][x].isEmpty = false;
    }

    function onCellClick(tile: Tile): void {
        console.log(`click: ${tile.y}:${tile.x}`);
        if (dead) return;
        if (!playing) setPlaying(true);
        if (tile.isFlagged) {
            onCellFlag(tile);
            return;
        }
        if (tile.isBomb) {
            setDead(true);
            setPlaying(false);
            revealBombs();
        }
        const newBoard = board.map((row) => row.map((col) => col));
        disableNeighbours(newBoard, tile.y, tile.x);
        setBoard(newBoard);
    }

    function onCellMiddle(tile: Tile): void {
        console.log(`middle: ${tile.y}:${tile.x}`);
        if (dead) return;
        if (tile.isFlagged) return;
        if (tile.isEmpty) return;
        let flagsAround = 0;
        for (let h = tile.y - 1; h <= tile.y + 1; h++) {
            if (h < 0) continue;
            if (h >= board.length) continue;
            for (let w = tile.x - 1; w <= tile.x + 1; w++) {
                if (w < 0) continue;
                if (w >= board.length) continue;
                if (board[h][w].isFlagged) flagsAround++;
            }
        }
        if (flagsAround !== tile.value) return;
        for (let h = tile.y - 1; h <= tile.y + 1; h++) {
            if (h < 0) continue;
            if (h >= board.length) continue;
            for (let w = tile.x - 1; w <= tile.x + 1; w++) {
                if (w < 0) continue;
                if (w >= board.length) continue;
                if (board[h][w].isFlagged) continue;
                onCellClick(board[h][w]);
            }
        }
    }

    function onCellFlag(tile: Tile): void {
        console.log(`flag: ${tile.y}:${tile.x}`);
        if (dead) return;
        if (!playing) setPlaying(true);
        if (tile.isDisabled) return;
        const newBoard = board.map((row) => row.map((col) => col));
        if (newBoard[tile.y][tile.x].isFlagged) {
            newBoard[tile.y][tile.x].isFlagged = false;
            setFlagCount(prev => prev - 1);
        } else {
            newBoard[tile.y][tile.x].isFlagged = true;
            setFlagCount(prev => prev + 1);
        }
        setBoard(newBoard);
    }

    function disableNeighbours(newBoard: Tile[][], y: number, x: number) {
        if (newBoard[y][x].isDisabled) return;
        newBoard[y][x].isDisabled = true;
        newBoard[y][x].isRevealed = true;
        newBoard[y][x].isFlagged = false;
        if (!newBoard[y][x].isEmpty) return;
        for (let h = y - 1; h <= y + 1; h++) {
            if (h < 0) continue;
            if (h >= newBoard.length) continue;
            for (let w = x - 1; w <= x + 1; w++) {
                if (w < 0) continue;
                if (w >= newBoard.length) continue;
                disableNeighbours(newBoard, h, w);
            }
        }
    }

    function revealBombs() {
        const newBoard = board.map(row => row.map(col => col));
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard.length; j++) {
                if (newBoard[i][j].isBomb) newBoard[i][j].isRevealed = true;
            }
        }
        setBoard(newBoard);
    }

    function checkWin(): boolean {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j].isBomb) continue;
                if (board[i][j].isFlagged) continue;
                return false;
            }
        }
        return true;
    }

    return (<>
        <div className="bg-primary" data-theme="valentine">
            {board?.map((row, i) => (
                <div key={i} className="flex flex-row">
                    {row.map((tile, j) => (
                        <Cell key={`${i}${j}`} tile={tile} click={onCellClick} flag={onCellFlag} middle={onCellMiddle} />
                    ))}
                </div>
            ))}
        </div>
    </>);
}

export default Board;
