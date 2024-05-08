import { useEffect, useState } from "react";

type Props = {
    running: boolean,
    reset: boolean;
}

function Stopwatch({ running, reset }: Props) {

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let intervalId: any;
        if (reset) {
            setSeconds(0);
        }
        if (running) {
            intervalId = setInterval(() => setSeconds(seconds + 1), 1000);
        }
        return () => clearInterval(intervalId);
    }, [running, seconds, reset]);

    return (
        <div className="stopwatch-container">
            <p className="stopwatch-time">
                {seconds.toString().padStart(5, "0")}
            </p>
        </div>
    );
};

export default Stopwatch;
