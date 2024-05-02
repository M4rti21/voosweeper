import { Tile } from "./Board";
import { colors, BG_EVN, BG_ODD, DIS_BG_EVN, DIS_BG_ODD } from "./constants";

type Props = {
    tile: Tile;
    click: (tile: Tile) => void,
    flag: (tile: Tile) => void,
}

function Cell({ tile, click, flag }: Props) {

    function getChar(): string | number {
        if (tile.isEmpty) return "";
        if (!tile.isRevealed) return "";
        if (tile.isBomb) return "";
        return tile.value;
    }

    function getBG(): string {
        if (tile.x % 2 === 0) {
            if (tile.y % 2 === 0) {
                if (tile.isDisabled) return DIS_BG_EVN;
                return BG_EVN;
            } else {
                if (tile.isDisabled) return DIS_BG_ODD;
                return BG_ODD;
            }
        } else {
            if (tile.y % 2 === 0) {
                if (tile.isDisabled) return DIS_BG_ODD;
                return BG_ODD;
            } else {
                if (tile.isDisabled) return DIS_BG_EVN;
                return BG_EVN;
            }
        }
    }

    return (
        <button className={`hover:brightness-90 disabled:hover:brightness-100 rounded-none size-8 cell ${tile.isRevealed ? tile.isBomb ? "bomb" : "" : tile.isFlagged ? "flag" : ""}`}
            disabled={tile.isDisabled} style={{ color: colors[tile.value], backgroundColor: getBG() }}
            onClick={() => click(tile)} onContextMenu={() => flag(tile)}>
            {getChar()}
        </button>
    );
}

export default Cell;
