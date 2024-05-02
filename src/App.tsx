import Board from "./Board";

function App() {
    return (
        <div className="App h-screen w-screen flex items-center justify-center">
            <Board size={10} bombs={10} />
        </div>
    );
}

export default App;
