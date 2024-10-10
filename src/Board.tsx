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
    isDummy: boolean;
    isBomb: boolean;
    isEmpty: boolean;
    isFlagged: boolean;
    isRevealed: boolean;
    isDisabled: boolean;
}

function Board({ diff, dead, playing, setDead, setPlaying, setFlagCount }: Props) {

    const [first, setFirst] = useState<Tile | undefined>();
    const [board, setBoard] = useState<Tile[][]>([]);

    useEffect(() => {
        createEmptyBoard();
    }, [diff]);

    useEffect(() => {
        if (!first) return;
        onCellClickNum(first.y, first.x);
    }, [first]);

    useEffect(() => {
        let flagCount = 0;
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.isFlagged) flagCount++;
            })
        })
        setFlagCount(flagCount);
        if (checkWin()) {
            console.log("aaaaaaaaa");
            setPlaying(false);
        }
    }, [board]);

    function createEmptyBoard() {
        setPlaying(false);
        const newBoard: Tile[][] = [];
        for (let i = 0; i < diff.size; i++) {
            newBoard.push([]);
            for (let j = 0; j < diff.size; j++) {
                newBoard[i].push({
                    y: i, x: j,
                    value: 0,
                    isDummy: true,
                    isBomb: false,
                    isEmpty: true,
                    isFlagged: false,
                    isRevealed: false,
                    isDisabled: false,
                });
            }
        }
        setBoard(newBoard);
        setFirst(undefined);
    }

    function placeBombs(startTile: Tile) {
        setFlagCount(0);
        const newBoard: Tile[][] = [];
        for (let i = 0; i < diff.size; i++) {
            newBoard.push([]);
            for (let j = 0; j < diff.size; j++) {
                newBoard[i].push({
                    y: i, x: j,
                    value: 0,
                    isDummy: false,
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
            if (randY == startTile.y && randX == startTile.x) continue;
            if (randY == startTile.y -1 && randX == startTile.x) continue;
            if (randY == startTile.y +1 && randX == startTile.x) continue;
            if (randY == startTile.y && randX == startTile.x +1 ) continue;
            if (randY == startTile.y && randX == startTile.x -1 ) continue;
            if (randY == startTile.y -1 && randX == startTile.x -1 ) continue;
            if (randY == startTile.y +1 && randX == startTile.x +1 ) continue;
            if (randY == startTile.y +1 && randX == startTile.x -1 ) continue;
            if (randY == startTile.y -1 && randX == startTile.x +1 ) continue;
            newBoard[randY][randX].value = BOMB_NUM;
            newBoard[randY][randX].isBomb = true;
            newBoard[randY][randX].isEmpty = false;
            placedBombsCount++;
        }
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard.length; j++) {
                placeNumbers(newBoard, i, j);
            }
        }
        setBoard(newBoard);
        setFirst(startTile);
    }

    function placeNumbers(newBoard: Tile[][], y: number, x: number) {
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

    function onCellClickNum(y: number, x: number) {
        onCellClick(board[y][x]);
    }

    function onCellClick(tile: Tile): void {
        console.log(`click: ${tile.y}:${tile.x}`);
        if (tile.isDummy) {
            placeBombs(tile);
            setPlaying(true);
            return;
        }
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
        } else {
            newBoard[tile.y][tile.x].isFlagged = true;
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
        for (let row of newBoard) {
            for (let cell of row) {
                if (cell.isBomb) cell.isRevealed = true;
            }
        }
        setBoard(newBoard);
    }

    function checkWin(): boolean {
        for (let row of board) {
            for (let cell of row) {
                if (cell.isBomb) continue;
                if (cell.isFlagged) continue;
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
