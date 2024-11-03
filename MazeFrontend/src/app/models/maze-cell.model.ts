export interface MazeCell {
    x: number;
    y: number;
    isWall: boolean;
    isStart: boolean;
    isEnd: boolean;
    isPath: boolean;
    isVisited: boolean;
    gCost: number;
    hCost: number;
    fCost: number;
}
