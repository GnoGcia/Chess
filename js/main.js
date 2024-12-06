// Recursive Moves
const rMoves = (currPos, ruleMov, pColor) => {
    // Array of valid matrix positions
    const vMoves = [];
    // Increment currPos in accordance with ruleMov
    const x = currPos[0] + ruleMov[0];
    const y = currPos[1] + ruleMov[1];
    // If x and y are within range...
    if(x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        // If (x, y) is an empty space...
        if(cBoard[x][y].cell === 'o') {
            // Append current position to vMoves
            vMoves.push([x, y]);
            // Recursively calculate next position
            vMoves.push(...rMoves([x, y], ruleMov, pColor));
        }
        // If (x, y) is an opposing PieceUnit instance
        else if(cBoard[x][y].cell[0] !== pColor) {
            // Append current position to vMoves
            vMoves.push([x, y]);
        }
    }
    // Return the array of valid matrix positions
    return vMoves;
};
// Step Movement
const moveI = (currPos, pColor, firstMove) => {
    // Array of valid matrix positions
    const vMoves = [];
    const x = currPos[0];
    const y = currPos[1];
    // Determine forward direction via pColor
    const z = pColor === 'b' ? 1 : -1;
    // Check left flank for opposing PieceUnit instance
    if (y > 0 && cBoard[x + z][y - 1].cell !== 'o' && cBoard[x + z][y - 1].cell[0] !== pColor) {
        // Append left flank to vMoves if opposing PieceUnit instance occupies space
        vMoves.push([x + z, y - 1]);
    }
    // Check right flank for opposing PieceUnit instance
    if (y < 7 && cBoard[x + z][y + 1].cell !== 'o' && cBoard[x + z][y + 1].cell[0] !== pColor) {
        // Append right flank to vMoves if opposing PieceUnit instance occupies space
        vMoves.push([x + z, y + 1]);
    }
    // Check availability of position forward from current position
    if(cBoard[x + z][y].cell === 'o') {
        // Append forward position if available
        vMoves.push([x + z, y]);
    }
    // If firstMove, check availability of position forward from forward position
    if(firstMove && cBoard[x + z][y].cell === 'o' && cBoard[x + z + z][y].cell === 'o') {
        // Append forward forward position if available
        vMoves.push([x + z + z, y]);
    }
    // Return the array of valid matrix positions
    return vMoves;
};
// Cross Movement
const moveT = (currPos, pColor) => {
    // Recursively calculate valid vertical and horizontal matrix positions
    const vMoves = [
        ...rMoves(currPos, [0, 1], pColor),  // Right
        ...rMoves(currPos, [1, 0], pColor),  // Down
        ...rMoves(currPos, [0, -1], pColor), // Left
        ...rMoves(currPos, [-1, 0], pColor)  // Up
    ];
    // Return the array of valid matrix positions
    return vMoves;
};
// Angular Movement
const moveL = (currPos, pColor) => {
    // Array of valid matrix positions
    const vMoves = [];
    // Calculate matrix positions two spaces away and one space adjacent from currPos
    const LMoves = [
        [currPos[0] + 2, currPos[1] + 1],[currPos[0] + 2, currPos[1] - 1], // Down Right/Left
        [currPos[0] - 2, currPos[1] + 1],[currPos[0] - 2, currPos[1] - 1], // Up Right/Left
        [currPos[0] + 1, currPos[1] + 2],[currPos[0] + 1, currPos[1] - 2], // Right Down/Up
        [currPos[0] - 1, currPos[1] + 2],[currPos[0] - 1, currPos[1] - 2]  // Left Down/Up
    ];
    // Validate each matrix position in LMoves for validity and availability
    LMoves.forEach(([x, y]) => {
        // If matrix position is within range...
        if(x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            // If the matrix position is empty or occupied by opposing PieceUnit instance...
            if((cBoard[x][y].cell === 'o') || (cBoard[x][y].cell[0] !== pColor)) {
                // Append matrix position to vMoves
                vMoves.push([x, y]);
            }
        }
    });
    // Return the array of valid matrix positions
    return vMoves;
};
// Diagonal Movement
const moveX = (currPos, pColor) => {
    // Recursively calculate valid diagonal matrix positions
    const vMoves = [
        ...rMoves(currPos, [1, 1], pColor),  // Down Right
        ...rMoves(currPos, [1, -1], pColor), // Down Left
        ...rMoves(currPos, [-1, 1], pColor), // Up Right
        ...rMoves(currPos, [-1, -1], pColor) // Up Left
    ];
    // Return the array of valid matrix positions
    return vMoves;
};
// Circular Movement
const moveO = (currPos, pColor) => {
    // Array of valid matrix positions
    const vMoves = [];
    // Calculate matrix positions one space away from currPos in all directions
    const OMoves = [
        [currPos[0] + 1, currPos[1]],[currPos[0] - 1, currPos[1]],         // Down, Up
        [currPos[0], currPos[1] + 1],[currPos[0], currPos[1] - 1],         // Right, Left
        [currPos[0] + 1, currPos[1] + 1],[currPos[0] + 1, currPos[1] - 1], // Down Right, Down Left
        [currPos[0] - 1, currPos[1] + 1],[currPos[0] - 1, currPos[1] - 1]  // Up Right, Up Left
    ];
    // Validate each matrix position in OMoves for validity and availability
    OMoves.forEach(([x, y]) => {
        // If matrix position is within range...
        if(x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            // If the matrix position is empty or occupied by opposing PieceUnit instance...
            if((cBoard[x][y].cell === 'o') || (cBoard[x][y].cell[0] !== pColor)) {
                // Append matrix position to vMoves
                vMoves.push([x, y]);
            }
        }
    });
    // Return the array of valid matrix positions
    return vMoves;
};
// PieceUnit Class
class PieceUnit {
    // Boolean that tracks turn status
    static wTurn = true;
    // Array of matrix positions for next-turn movement
    static movePos = []
    // Parameterized Constructor
    constructor(type, isW, currPos) {
        // Assign type to self
        this.type = type;
        // Assign moveSet and conditionals with respect to type
        switch(type) {
            case "pawn":
                this.moveSet = [moveI];
                this.conditionals = [true]; // firstMove
                break;
            case "rook":
                this.moveSet = [moveT];
                break;
            case "horse":
                this.moveSet = [moveL];
                break;
            case "bishop":
                this.moveSet = [moveX];
                break;
            case "queen":
                this.moveSet = [moveT, moveX];
                break;
            case "king":
                this.moveSet = [moveO];
                this.conditionals = [false]; // check
                break;
        }
        // Assign isW to self
        this.isW = isW;
        // Generate strRep with respect to type and isW
        this.strRep = isW ? `w${type[0]}` : `b${type[0]}`;
        // Assign currPos to self
        this.currPos = currPos;
    }
    // Display valid movement positions to the frontend
    showMoves() {
        // Validate PieceUnit instance interaction
        if(this.isW !== PieceUnit.wTurn) {
            return;
        }
        // Log action
        console.log(`SHOW: ${this.strRep} @ ${cBoard[this.currPos[0]][this.currPos[1]].coord}`);
        // Render most up-to-date board
        renderBoard(PieceUnit.wTurn);
        // Derive PieceUnit instance color from its strRep
        const pColor = this.strRep[0];
        // Populate movePos with moveSet return values
        PieceUnit.movePos = [];
        this.moveSet.forEach(moveFunction => {
            PieceUnit.movePos.push(...moveFunction(this.currPos, pColor, this.type === 'pawn' ? this.conditionals[0] : null));
        });
        // Display movePos and assign click listeners
        PieceUnit.movePos.forEach(([x, y]) => {
            cBoard[x][y].element.src = `../img/${pColor}Move.png`;
            cBoard[x][y].element.onclick = () => {
                PieceUnit.movePos.forEach(([x, y]) => {
                    cBoard[x][y].element.src = cBoard[x][y].cell !== 'o' ? `../img/${cBoard[x][y].cell}.png` : '';
                    cBoard[x][y].element.onclick = null;
                });
                this.makeMove([x, y]);
            }
        });
    }
    // Swap a PieceUnit instance's currPos with pos
    async makeMove(pos) {
        // Log action
        console.log(`MAKE: ${this.strRep} @ ${cBoard[this.currPos[0]][this.currPos[1]].coord} => ${cBoard[pos[0]][pos[1]].coord}`);
        // If pos is occupied by opposing PieceUnit instance
        const destination = cBoard[pos[0]][pos[1]].cell;
        if(destination !== 'o') {
            // Fetch opposing PieceUnit instance from appropriate color array
            const cPieces = destination[0] === 'w' ? wPU : bPU;
            const cIndex = cPieces.findIndex(pUnit => pUnit.currPos[0] === pos[0] && pUnit.currPos[1] === pos[1]);
            // Remove opposing PieceUnit instance from color array
            cPieces.splice(cIndex, 1);
        }
        // Update cBoard matrix position values
        cBoard[pos[0]][pos[1]].cell = this.strRep;
        cBoard[this.currPos[0]][this.currPos[1]].cell = 'o';
        // Update frontend elements
        cBoard[pos[0]][pos[1]].element.src = `../img/${this.strRep}.png`;
        cBoard[this.currPos[0]][this.currPos[1]].element.src = '';
        // Update PieceUnit instance currPos to pos
        this.currPos = pos;
        // Toggle wTurn
        PieceUnit.wTurn = !PieceUnit.wTurn;
        // If the current PieceUnit instance is of type pawn...
        if(this.type === 'pawn') {
            // Set firstMove conditional to false
            this.conditionals[0] = false;
            // If pawn PieceUnit instance has reached its respective end of the board...
            const boardEnd = this.isW ? 0 : 7;
            if(this.currPos[0] === boardEnd) {
                // Display upgrade menu and await selection
                await this.showUpgrades();
            }
        }
        // Render most up-to-date board
        renderBoard(PieceUnit.wTurn);
    }
    // Display PieceUnit upgrades
    async showUpgrades() {
        // Initialize array of PieceUnit upgrade Types
        const postfix = ['rook', 'horse', 'bishop', 'queen'];
        return new Promise((resolve) => {
            // Iterate and set element image values 
            for(let i = 0; i < postfix.length; i++) {
                const opt = document.getElementById(`s${i + 1}`);
                opt.src = `../img/${this.strRep[0]}${postfix[i][0]}.png`;
                // Apply click listener for PieceUnit type selection
                opt.onclick = () => {
                    this.makeUpgrade(postfix[i]);
                    resolve();
                };
            }
            // Make PieceUnit upgrade menu visible
            const select = document.querySelector('.sContainer');
            select.style.visibility = 'visible';
        })
    }
    // Upgrade PieceUnit instance
    makeUpgrade(type) {
        // Update PieceUnit instance type
        this.type = type;
        // Update PieceUnit instance strRep with respect to type
        this.strRep = `${this.strRep[0]}${type[0]}`;
        // Update PieceUnit instance cBoard representation with respect to strRep
        cBoard[this.currPos[0]][this.currPos[1]].cell = this.strRep;
        // Update PieceUnit instance conditionals to null
        this.conditionals = null;
        // Update PieceUnit instance moveSet with respect to type
        switch(type) {
            case "rook":
                this.moveSet = [moveT];
                break;
            case "horse":
                this.moveSet = [moveL];
                break;
            case "bishop":
                this.moveSet = [moveX];
                break;
            case "queen":
                this.moveSet = [moveT, moveX];
                break;
        }
        // Hide and reset PieceUnit upgrade menu elements
        const select = document.querySelector('.sContainer');
        select.style.visibility = 'hidden';
        for(let i = 1; i < 5; i++) {
            const opt = document.getElementById(`s${i}`);
            opt.src = ``;
            opt.onclick = null;
        }
        // Update frontend PieceUnit instance image representation
        cBoard[this.currPos[0]][this.currPos[1]].element.src = `../img/${this.strRep}.png`;
    }
}
// Array of white PieceUnit instances
let wPU = [];
// Array of black PieceUnit instances
let bPU = [];
// Matrix representing chess board
let cBoard = [];
// Assign initial values to declared arrays
const initializeGame = () => {
    // Array of initial white PieceUnit instances
    wPU = [
        new PieceUnit("pawn", true, [6,0]),
        new PieceUnit("pawn", true, [6,1]),
        new PieceUnit("pawn", true, [6,2]),
        new PieceUnit("pawn", true, [6,3]),
        new PieceUnit("pawn", true, [6,4]),
        new PieceUnit("pawn", true, [6,5]),
        new PieceUnit("pawn", true, [6,6]),
        new PieceUnit("pawn", true, [6,7]),
        new PieceUnit("rook", true, [7,0]),
        new PieceUnit("horse", true, [7,1]),
        new PieceUnit("bishop", true, [7,2]),
        new PieceUnit("queen", true, [7,3]),
        new PieceUnit("king", true, [7,4]),
        new PieceUnit("bishop", true, [7,5]),
        new PieceUnit("horse", true, [7,6]),
        new PieceUnit("rook", true, [7,7])
    ];
    // Array of initial black PieceUnit instances
    bPU = [
        new PieceUnit("pawn", false, [1,0]),
        new PieceUnit("pawn", false, [1,1]),
        new PieceUnit("pawn", false, [1,2]),
        new PieceUnit("pawn", false, [1,3]),
        new PieceUnit("pawn", false, [1,4]),
        new PieceUnit("pawn", false, [1,5]),
        new PieceUnit("pawn", false, [1,6]),
        new PieceUnit("pawn", false, [1,7]),
        new PieceUnit("rook", false, [0,0]),
        new PieceUnit("horse", false, [0,1]),
        new PieceUnit("bishop", false, [0,2]),
        new PieceUnit("queen", false, [0,3]),
        new PieceUnit("king", false, [0,4]),
        new PieceUnit("bishop", false, [0,5]),
        new PieceUnit("horse", false, [0,6]),
        new PieceUnit("rook", false, [0,7])
    ];
    // Populate 8x8 cBoard with empty positions 'o', frontend coordinate values, and element fetching
    cBoard = Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => ({
            cell: 'o',
            coord: String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i),
            element: document.getElementById(String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i))
        }))
    );
    // Insert PieceUnit instances in cBoard at currPos
    const insertPieceUnit = (pUnit) => {
        cBoard[pUnit.currPos[0]][pUnit.currPos[1]].cell = pUnit.strRep;
        cBoard[pUnit.currPos[0]][pUnit.currPos[1]].element.src = `../img/${pUnit.strRep}.png`;
    }
    [...wPU, ...bPU].forEach(insertPieceUnit);
    // Draw chess board
    renderBoard(PieceUnit.wTurn);
}
// Display cBoard to frontend
const renderBoard = (wTurn) => {
    // Check check status
    checkCheck();
    // Check win condition
    wTurn = gameEnd(wTurn);
    // Render team color opacity with respect to wTurn
    const wTeam = document.querySelector('.wTurn');
    const bTeam = document.querySelector('.bTurn');
    wTeam.style.opacity = wTurn ? '100%' : '50%';
    bTeam.style.opacity = !wTurn ? '100%' : '50%';
    // Set currTeam to appropriate color prefix
    const currTeam = wTurn ? 'w' : 'b';
    // Iterate through cBoard
    for (let i = 0; i < cBoard.length; i++) {
        for (let j = 0; j < cBoard[i].length; j++) {
            // Display PieceUnit instances to frontend
            cBoard[i][j].element.src = cBoard[i][j].cell !== 'o' ? `../img/${cBoard[i][j].cell}.png` : '';
            // Assign click listeners to currTeam PieceUnit instances
            if(cBoard[i][j].cell[0] === currTeam) {
                cBoard[i][j].element.onclick = () => {
                    const cPieces = wTurn ? wPU : bPU;
                    const cIndex = cPieces.findIndex(pUnit => pUnit.currPos[0] === i && pUnit.currPos[1] === j);
                    cPieces[cIndex].showMoves();
                }
            }
            // Remove click listeners from non-currTeam cells
            else {
                cBoard[i][j].element.onclick = null;
            }
        }
    }
}
// Check check status of each king PieceUnit instance
const checkCheck = () => {
    // Check check status
    const isCheck = (pI, pU, pColor) => {
        // If king PieceUnit instance does not exist, exit function call
        if(!pI) {
            return;
        }
        // Iterate through each element in opposite PieceUnit color array
        for(let i = 0; i < pU.length; i++) {
            // Fetch movement coordinates from PieceUnit instance moveSet
            let pMoves = [];
            pU[i].moveSet.forEach(moveFunction => {
                pMoves.push(...moveFunction(pU[i].currPos, pColor, pU[i].type === 'pawn' ? pU[i].conditionals[0] : null));
            })
            // Iterate through each coordinate in pMoves
            for(let j = 0; j < pMoves.length; j++) {
                const [x, y] = pMoves[j];
                // If current coordinate matches king PieceUnit instance currPos...
                if(x === pI.currPos[0] && y === pI.currPos[1]) {
                    // Set king PieceUnit instance check conditional to true and exit loop
                    pI.conditionals[0] = true;
                    break;
                }
            }
            // If king PieceUnit instance check condtional is true, exit loop
            if(pI.conditionals[0]) {
                break;
            }
            // If loop has reached its end, set king PieceUnit instance check conditional to false
            if(i === pU.length - 1) {
                pI.conditionals[0] = false;
            }
        }
        // Fetch pStatus element opposite of pColor
        const pStatus = document.querySelectorAll(`.${(pColor === 'w') ? 'b' : 'w'}Status`);
        // If king PieceUnit instance check condition is true...
        if(pI.conditionals[0]) {
            // Set pStatus to check
            pStatus.forEach(pS => {
                pS.src = '../img/cCheck.png';
            })
            // Set king PieceUnit instance check condition to false
            pI.conditionals[0] = false;
        }
        // If king PieceUnit instance check condition is false...
        else {
            // Set pStatus to default
            pStatus.forEach(pS => {
                pS.src = `../img/${(pColor === 'w') ? 'b' : 'w'}move.png`;
            })
        }
    }
    // Check check status of Black King PieceUnit
    isCheck(bPU[bPU.findIndex(bUnit => bUnit.type === 'king')], wPU, 'w');
    // Check check status of White King PieceUnit
    isCheck(wPU[wPU.findIndex(wUnit => wUnit.type === 'king')], bPU, 'b');
}
// Check win condition
const gameEnd = (wTurn) => {
    // Search both color PieceUnit instance arrays for king unit
    const wKing = wPU.some(pUnit => pUnit.strRep === 'wk');
    const bKing = bPU.some(pUnit => pUnit.strRep === 'bk');
    // Fetch team statuses
    const wStatus = document.querySelectorAll('.wStatus');
    const bStatus = document.querySelectorAll('.bStatus');
    // If white PieceUnit king instance is missing
    if (!wKing) {
        // Crown black team
        bStatus.forEach(bS => {
            bS.src = '../img/cCrown.png';
        })
        // Reset white team
        wStatus.forEach(wS => {
            wS.src = '../img/wMove.png';
        })
        // Toggle and return wTurn
        return !wTurn;
    }
    // If black PieceUnit king instance is missing
    if (!bKing) {
        // Crown white team
        wStatus.forEach(wS => {
            wS.src = '../img/cCrown.png';
        })
        // Reset black team
        bStatus.forEach(bS => {
            bS.src = '../img/bMove.png';
        })
        // Toggle and return wTurn
        return !wTurn;
    }
    // If both king units are present, return wTurn
    return wTurn;
}
// Execute Chess Game
initializeGame();