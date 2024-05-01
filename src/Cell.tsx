import { Tile } from "./Board";
import { BG_EVN, BG_ODD, BOMB, BOMB_NUM, colors, DIS_BG_EVN, DIS_BG_ODD, FLAG } from "./constants";

type Props = {
    tile: Tile;
    click: (tile: Tile) => void,
    flag: (tile: Tile) => void,
}

function Cell({ tile, click, flag }: Props) {

    function getChar(): string {
        if (tile.flagged) return "";
        if (!tile.dis) return "";
        if (tile.num === BOMB_NUM) return "";
        if (tile.num > 0) return tile.num.toString();
        return "";
    }

    function getBG(): string {
        if (tile.x % 2 === 0) {
            if (tile.y % 2 === 0) {
                if (tile.dis) return DIS_BG_EVN;
                return BG_EVN;
            } else {
                if (tile.dis) return DIS_BG_ODD;
                return BG_ODD;
            }
        } else {
            if (tile.y % 2 === 0) {
                if (tile.dis) return DIS_BG_ODD;
                return BG_ODD;
            } else {
                if (tile.dis) return DIS_BG_EVN;
                return BG_EVN;
            }
        }
    }

    return (<>
        <button className={`hover:brightness-90 disabled:hover:brightness-100 rounded-none size-8 cell ${tile.dis ? tile.num === 9 ? "bomb" : "" : tile.flagged ? "flag" : ""}`} disabled={tile.dis}
            style={{ color: colors[tile.num], backgroundColor: getBG() }}
            onClick={() => click(tile)} onContextMenu={() => flag(tile)}>
            {getChar()}
        </button>
    </>);
}

export default Cell;
