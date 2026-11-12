export const labels = {EL:'Electrician', CP:'Carpenter', NS:'Nurse', SD:'Software Developer', RE:'Renewable Energy Technician', EC:'Early Childhood Educator'};
const formation = [['EL',1,0],['CP',2,1],['NS',3,1],['SD',4,1],['RE',5,1],['EC',6,1],['CP',6,0],['SD',7,0]];
export const startingPieces = () => ['A','B'].flatMap(team=>formation.map(([code,col,row],index)=>({
  id:team+index,team,code,col,row:team==='A'?7-row:row,
})));
export const squareName = (col,row) => String.fromCharCode(65+col)+(8-row);

export const territoryChoices = {
  route: {name:'Access Route', icon:'M36 84H58V45H91 M75 29L91 45L75 61', description:'Either team may land here. On its next move from here, a piece keeps its normal moves and may also slide any distance straight or diagonally, without jumping other pieces.'},
  closure: {name:'Safety Closure', icon:'M90 64A26 26 0 1 1 38 64A26 26 0 1 1 90 64 M46 46L82 82', description:'Neither team may land here. The piece already on the square can move out normally.'},
  permit: {name:'Team Permit', icon:'M64 32L88 42V61Q88 81 64 94Q40 81 40 61V42Z M53 63L61 71L76 53', description:'Only pieces from the owner’s team may land here. The opposing team cannot enter or challenge a piece on this square.'},
};
export const territoryEffects = {
  ...territoryChoices,
  hub: {name:'Support Hub', icon:'M36 61L64 37L92 61 M44 58V89H84V58 M64 64V79 M56 71H72', description:'While this square is empty, one of the owner’s pieces that loses a later duel can return here.'},
};
function canEnter(piece,tile) {
  return tile?.effect!=='closure' && (tile?.effect!=='permit'||tile.holder===piece.team);
}
export function legalMoves(piece,pieces,tiles={}) {
  const diagonal=[[-1,-1],[1,-1],[-1,1],[1,1]];
  const straight=[[0,-1],[0,1],[-1,0],[1,0]];
  const forward=piece.team==='A'?-1:1;
  const scout=['SD','EC'].includes(piece.code);
  const vectors=scout?[[-1,forward],[0,forward],[1,forward]]:
    piece.code==='CP'?diagonal:piece.code==='NS'?straight:[...diagonal,...straight];
  const moves=vectors.flatMap(([dx,dy])=>{
    const col=piece.col+dx,row=piece.row+dy;
    if(col<0||row<0||col>7||row>7||!canEnter(piece,tiles[col+','+row]))return [];
    const target=pieces.find(item=>item.col===col&&item.row===row);
    if(target?.team===piece.team||(scout&&Boolean(dx)!==Boolean(target)))return [];
    return [{col,row,target:target?.id??null}];
  });
  const origin=tiles[piece.col+','+piece.row];
  if(origin?.effect==='route') {
    for(const [dx,dy] of [...diagonal,...straight]) {
      for(let step=1;step<8;step++) {
        const col=piece.col+dx*step,row=piece.row+dy*step;
        if(col<0||row<0||col>7||row>7)break;
        const target=pieces.find(item=>item.col===col&&item.row===row);
        if(target?.team!==piece.team&&canEnter(piece,tiles[col+','+row])&&
            !moves.some(move=>move.col===col&&move.row===row)) {
          moves.push({col,row,target:target?.id??null});
        }
        if(target)break;
      }
    }
  }
  return moves;
}
