import { useEffect, useState } from "react";
import Cell from "./Cell";
import { BOMB_NUM } from "./constants";
import Stopwatch from "./Stopwatch";

type Props = {
    size: number,
    bombs: number,
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

function Board({ size, bombs }: Props) {

    const [board, setBoard] = useState<Tile[][]>([]);
    const [flagCount, setFlagCount] = useState<number>(0);

    const [dead, setDead] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeReset, setTimeReset] = useState<boolean>(false);

    useEffect(() => {
        populateBoard();
    }, []);

    useEffect(() => {
        if (!checkWin()) return;
        setPlaying(false);
    }, [board]);

    function populateBoard() {
        setFlagCount(0);
        const newBoard: Tile[][] = [];
        for (let i = 0; i < size; i++) {
            newBoard.push([]);
            for (let j = 0; j < size; j++) {
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
        while (placedBombsCount < bombs) {
            const randY = Math.floor(Math.random() * size);
            const randX = Math.floor(Math.random() * size);
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

    function onCellFlag(tile: Tile): void {
        if (dead) return;
        if (!playing) setPlaying(true);
        if (tile.isDisabled) return;
        const newBoard = board.map((row) => row.map((col) => col));
        if (newBoard[tile.y][tile.x].isFlagged) {
            newBoard[tile.y][tile.x].isFlagged = false;
            setFlagCount((prev) => prev - 1);
        } else {
            newBoard[tile.y][tile.x].isFlagged = true;
            setFlagCount((prev) => prev + 1);
        }
        setBoard(newBoard);
    }

    function onCellClick(tile: Tile): void {
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

    function reset() {
        setDead(false);
        setTimeReset(true);
        setTimeout(() => {
            setTimeReset(false);
        }, 0);
        populateBoard();
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

    return (<div className="flex flex-col bg-secondary">
        <div className="grid grid-cols-3 items-center">
            <div className="text-black flex items-center justify-center">
                <Stopwatch running={playing} reset={timeReset} />
            </div>
            <div className="flex items-center justify-center">
                <button onClick={() => reset()}
                    className="btn btn-primary rounded-none p-1 m-0 h-9 min-h-0">
                    <span className="smile size-6" />
                </button>
            </div>
            <div className="text-black flex items-center justify-center">
                {flagCount.toString().padStart(3, "0")}
            </div>
        </div>
        <div className="bg-primary" data-theme="valentine">
            {board?.map((row) => (
                <div className="flex flex-row">
                    {row.map((tile) => (
                        <Cell tile={tile} click={onCellClick} flag={onCellFlag} />
                    ))}
                </div>
            ))}
        </div>
    </div>);
}

export default Board;
