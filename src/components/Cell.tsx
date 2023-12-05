import {cell_type} from "./Board";

interface Props {
    cell: cell_type;
}


const Cell = (p: Props) => {
    return (
        <div className="w-10 h-10 border text-center">{p.cell}</div>
    );
}

export default Cell;