import { useEffect, useState } from "react";
import Board from "./Board";
import Stopwatch from "./Stopwatch";

export type Difficulty = {
    id: number,
    name: string,
    size: number,
    bombs: number
}

function App() {

    const difficulties: Difficulty[] = [
        {
            id: 0,
            name: "easy",
            size: 9,
            bombs: 10
        },
        {
            id: 1,
            name: "intermediate",
            size: 16,
            bombs: 40,
        },
        {
            id: 2,
            name: "expert",
            size: 30,
            bombs: 99
        },
        {
            id: 3,
            name: "<3",
            size: 100,
            bombs: 727
        }
    ]

    const [diff, setDiff] = useState(difficulties[0]);

    function handleDiffChange(e: any): void {
        e.preventDefault();
        setDiff({ ...difficulties[parseInt(e.currentTarget.value)] });
    }

    const [dead, setDead] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);

    const [flagCount, setFlagCount] = useState<number>(0);
    const [timeReset, setTimeReset] = useState<boolean>(false);

    function reset() {
        setDead(false);
        setTimeReset(true);
        setTimeout(() => {
            setTimeReset(false);
        }, 0);
        setDiff({ ...diff });
    }

    return (<>
        <nav className="bg-pink-400 w-full sticky top-0 p-2 px-4 grid grid-cols-3 gap-8">
            <label className="flex flex-row items-center gap-4">
                <span>
                    Difficulty:
                </span>
                <select onChange={handleDiffChange}
                    className="select select-secondary w-full max-w-xs">
                    {difficulties.map((d) =>
                        <option key={d.id} value={d.id}>{d.name}</option>
                    )}
                </select>
            </label>
            <div className="grid grid-cols-3 items-center">
                <div className="flex flex-col justify-center items-center">
                    <label>Time:</label>
                    <div className="text-black flex items-center justify-center">
                        <Stopwatch running={playing} reset={timeReset} />
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <button onClick={() => reset()}
                        className="btn btn-primary rounded-none p-1 m-0 h-9 min-h-0">
                        <span className="smile size-6" />
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <label>Flags:</label>
                    <div className="text-black flex items-center justify-center">
                        {flagCount.toString().padStart(3, "0")}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <h1 className="text-3xl">voosweeper</h1>
            </div>
        </nav>
        <div className="App flex flex-col min-h-screen min-w-screen overflow-scroll" onContextMenu={(e) => e.preventDefault()}>
            <main className="grow flex items-center justify-center">
                <div className="flex bg-stone-700 p-2">
                    <Board diff={diff} setFlagCount={setFlagCount} setDead={setDead} setPlaying={setPlaying} dead={dead} playing={playing} />
                </div>
            </main>
        </div>
    </>);
}

export default App;
