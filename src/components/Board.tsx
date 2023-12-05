import { useEffect, useState } from "react";
import Cell from "./Cell";

export type cell_type = number;

const Board = () => {

    const MINE: string = 'x';
    const SAFE: string = ' ';
    const COVR: string = '#';
    const FLAG: string = 'f';

    const [size, setSize] = useState<number>(10);
    const [bombs, setBombs] = useState<number>(10);
    const [board, setBoard] = useState<cell_type[][]>([]);

    useEffect(() => {
        createBoard(size);
    }, [size]);

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen gap-2">
            <input onChange={(e) => setSize(e.target.valueAsNumber)} type="number"
                className="border border-black rounded-full" />
            <div className="bg-green-800">
                {board.map((r) =>
                    <div className="flex flex-row">{r.map((c) =>
                        <Cell cell={c} />
                    )}</div>
                )}
            </div>
        </div>
    )

    function createBoard(size: number): void {
        let tau1: string[][] = [];
        let tau2: string[][] = [];

        for (let i = 0; i < size; i++) {
            tau1.push([]);
            tau2.push([]);
            for (let j = 0; j < size; j++) {
                tau1[i].push('0');
                tau2[i].push(COVR);
            }
        }

        let y: number;
        let x: number;

        for (let i = 0; i < bombs; i++) {
            y = Math.floor(Math.random() * tau1.length);
            x = Math.floor(Math.random() * tau1[0].length);
            if (tau1[y][x] === MINE) {
                i--;
            } else {
                tau1[y][x] = MINE;
            }
        }

        console.log(tau1);
        console.log(tau2);

        // for (let i = 0; i < size; i++) {
        //     for (let j = 0; j < size; j++) {
        //         tau2[i][j] = '0';
        //     }
        // }

        // for (let i = 0; i < tau1.length; i++) {
        //     for (let j = 0; j < tau1[0].length; j++) {
        //         tau1[i][j] = SAFE;
        //         tau2[i][j] = COVR;
        //     }
        // }

        // Random r = new Random();
        // ArrayList<String> bombes = new ArrayList<String>();
        // int x, y;
        // for (int i = 0; i < tau.length; i++) {
        // 	for (int j = 0; j < tau[0].length; j++) {
        // 		tau[i][j] = safe;
        // 		tau2[i][j] = cover;
        // 	}
        // }
        // for (int i = 0; i < p.mines; i++) {
        // 	y = r.nextInt(0, tau.length);
        // 	x = r.nextInt(0, tau[0].length);
        // 	if (bombes.contains(y + "," + x)) {
        // 		i--;
        // 	} else {
        // 		bombes.add(y + "," + x);
        // 		tau[y][x] = mine;
        // 	}
        // }

        // fillBoard(table);
    }

    function fillBoard(table: cell_type[][]): void {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const r = Math.random();
                if (r < .8) continue;
                table[i][j] = 10;
            }
        }
        placeNumbers(table);
    }

    function placeNumbers(table: cell_type[][]): void {
        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[0].length; j++) {
                if (table[i][j] === 10) placeAround(i, j, table);
            }
        }
        setBoard(table);
    }

    function placeAround(y: number, x: number, table: cell_type[][]): void {
        for (let i = y - 1; i < y + 1; i++) {
            for (let j = x - 1; j < x + 1; j++) {
                if (i > 0) continue;
                console.log("1");
                if (i < table.length) continue;
                console.log("2");
                if (j > 0) continue;
                console.log("3");
                if (j < table[0].length) continue;
                console.log("4");
                if (table[i][j] !== 10) continue;
                console.log("5");
                table[i][j]++;
            }
        }
    }

}

export default Board;