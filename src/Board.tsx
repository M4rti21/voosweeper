import { useEffect, useState } from "react";
import Cell from "./Cell";
import { BOMB_NUM } from "./constants";
import Stopwatch from "./Stopwatch";

type Props = {
    size: number,
    bombs: number,
}

export type Tile = {
    num: number;
    dis: boolean;
    flagged: boolean;
    y: number;
    x: number;
}

function Board({ size, bombs }: Props) {

    const [board, setBoard] = useState<Tile[][]>([]);
    const [playing, setPlaying] = useState<boolean>(false);
    const [dead, setDead] = useState<boolean>(false);
    const [timeReset, setTimeReset] = useState<boolean>(false);

    useEffect(() => {
        populateBoard();
    }, []);

    function populateBoard() {
        const newBoard: Tile[][] = [];
        for (let i = 0; i < size; i++) {
            newBoard.push([]);
            for (let j = 0; j < size; j++) {
                newBoard[i].push({ num: 0, dis: false, flagged: false, y: i, x: j });
            }
        }
        let placedBombsCount = 0;
        while (placedBombsCount < bombs) {
            const randY = Math.floor(Math.random() * size);
            const randX = Math.floor(Math.random() * size);
            if (newBoard[randY][randX].num === BOMB_NUM) continue;
            newBoard[randY][randX].num = BOMB_NUM;
            placedBombsCount++;
        }
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                findBombs(newBoard, i, j);
            }
        }
        setBoard(newBoard);
    }

    function findBombs(board: Tile[][], y: number, x: number) {
        if (board[y][x].num === BOMB_NUM) return;
        let count = 0;
        for (let h = y - 1; h <= y + 1; h++) {
            if (h < 0) continue;
            if (h >= size) continue;
            for (let w = x - 1; w <= x + 1; w++) {
                if (w < 0) continue;
                if (w >= size) continue;
                if (board[h][w].num === BOMB_NUM) count++;
            }
        }
        if (count === 0) return;
        board[y][x].num = count;
    }

    function onCellFlag(tile: Tile): void {
        if (tile.dis) return;
        const newBoard = board.map((row) => row.map((col) => col));
        newBoard[tile.y][tile.x].flagged = !tile.flagged;
        setBoard(newBoard);
    }

    function onCellClick(tile: Tile): void {
        if (dead) return;
        if (!playing) setPlaying(true);
        if (tile.flagged) {
            onCellFlag(tile);
            return;
        }
        if (tile.num === BOMB_NUM) {
            setDead(true);
            setPlaying(false);
        }
        const newBoard = board.map((row) => row.map((col) => col));
        disableNeighbours(newBoard, tile.y, tile.x);
        setBoard(newBoard);
    }

    function disableNeighbours(newBoard: Tile[][], y: number, x: number) {
        if (newBoard[y][x].dis) return;
        newBoard[y][x].dis = true;
        newBoard[y][x].flagged = false;
        if (newBoard[y][x].num > 0) return;
        for (let h = y - 1; h <= y + 1; h++) {
            if (h < 0) continue;
            if (h >= size) continue;
            for (let w = x - 1; w <= x + 1; w++) {
                if (w < 0) continue;
                if (w >= size) continue;
                disableNeighbours(newBoard, h, w);
            }
        }
    }

    function reset() {
        setDead(false);
        setTimeReset(true);
        setTimeout(() => {
            setTimeReset(false);
        }, 0);
        populateBoard();
    }

    return (<div className="flex flex-col items-center">
        <div className="flex flex-row gap-8">
            <Stopwatch running={playing} reset={timeReset} />
            <button onClick={() => reset()} className="size-6 smile" />
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
