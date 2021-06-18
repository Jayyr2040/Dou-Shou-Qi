//! Program = Data + Logic (Made of functions) // APP13.JS is the latest file to be uploaded on 17th June 2021
//! Input => Functions => Output (console, Jquery)
//! Data => (nouns) variables, array, objects
//! Logic -> (verbs) functions
let isA = "A";                                                // This variable is used for determining whether Player A or B's turn
const riverEntryArr = [[2,1],[2,2],[2,4],[2,5],[3,0],[3,3],[3,6],[4,0],[4,3],[4,6],[5,0],[5,3],[5,6],[6,1],[6,2],[6,4],[6,5]]; //coordinates direct around river coordinates
const riverExitArr = [[3,1],[3,2],[3,4],[3,5],[4,1],[4,2],[4,4],[4,5],[5,1],[5,2],[5,4],[5,5]]; //coordinates of the 2 river
const trapArrB = [[0,2],[0,4],[1,3]];                         // Player B trap (this is for determing the reduction in power when A goes in)
const trapArrA = [[7,3],[8,2],[8,4]];                         // Player A trap (this is for determing the reduction in power when B goes in)
let playOnce = 0;
let step1 = true;                                             // This is for indicating if it is the first step of animal selection, step 2 is next move selection
const ardRiverHorizonArr = [[2,1],[2,2],[2,4],[2,5],[6,1],[6,2],[6,4],[6,5]];               // This is used for setting conditions when along horizontal axis ard river
const ardRiverVerticalArr= [[3,0],[3,3],[3,6],[4,0],[4,3],[4,6],[5,0],[5,3],[5,6]];         // This is used for setting conditions when along vertical axis ard river
let highlight = [];                                                                         // This is used storing the cells to be highlighted for next possible moves
let CoordinateArr = [];                                                                     // This is for storing current and next Coordinates
let AnimalArr = [];                                                                         // For storing current animal selected and the next item
let isOut = false;                                                                            
let validMove ="";                                                                          // This is the orders based on user selection, base case is "" - ie not valid
let messageTitle = "Not a valid Move";
let messageBody = "Please choose again!";

const game = {
    // Numbers in the board array represent the respective animal in the Animal array below. The corresponding rows and cols will be linked to the divs
    // to be represented in the HTML
      // Player 1 : 1-rat, 2-cat, 3-wolf, 4-dog, 5-leopard, 6-tiger, 7-lion, 8-elephant, 9-river, 10-trap, 21-den
    // Player 2 : 11-rat, 12-cat, 13-wolf, 14-dog, 15-leopard, 16-tiger, 17-lion, 18-elephant, 19-river, 20-trap, 22-den
        Board : [[17,0,20,22,20,0,16],
                [0,14,0,20,0,12,0],
                [11,0,15,0,13,0,18],
                [0,9,9,0,9,9,0],
                [0,9,9,0,9,9,0],
                [0,9,9,0,9,9,0],
                [8,0,3,0,5,0,1],
                [0,2,0,10,0,4,0],
                [6,0,10,21,10,0,7]],
        // for resetting 
        Board2 : [[17,0,20,22,20,0,16],
                [0,14,0,20,0,12,0],
                [11,0,15,0,13,0,18],
                [0,9,9,0,9,9,0],
                [0,9,9,0,9,9,0],
                [0,9,9,0,9,9,0],
                [8,0,3,0,5,0,1],
                [0,2,0,10,0,4,0],
                [6,0,10,21,10,0,7]],

        // Index of this Animal array corresponds to the Number ID inside the Board array above 
        // Note: Animal power is fixed, except when it enters the trap, it will be lowered to 0; 
        Animal : [{name:  "empty space", power: 0, source: "images/space.png", sound : "sound/unlock.wav"}, 
                {name: "rat", power: 1, source: "images/rat1.png",sound : "sound/rat.wav"}, //eg Player 1 index 1 - rat
                {name: "cat", power: 2, source: "images/cat1.png",sound : "sound/cat.mp3"},
                {name: "wolf", power: 3, source: "images/wolf1.png",sound : "sound/wolf.wav"},
                {name: "dog", power: 4, source: "images/dog1.png",sound : "sound/dog.wav"},
                {name: "leopard", power: 5, source: "images/leopard1.png",sound : "sound/leopard.wav"},
                {name: "tiger", power: 6, source: "images/tiger1.png",sound : "sound/tiger.flac"},
                {name: "lion", power: 7, source: "images/lion1.png",sound : "sound/lion.wav"},
                {name: "elephant", power: 8, source: "images/elephant1.png",sound : "sound/elephant.wav"},
                {name: "river", power: 0, source: "images/river.png",sound : "sound/jungle.wav"},
                {name: "trap", power: 0, source: "images/trap1.png",sound : ""}, 
                {name: "rat", power: 1, source: "images/rat2.png",sound : "sound/rat.wav"}, //eg Player 2 index 1 - rat
                {name: "cat", power: 2, source: "images/cat2.png",sound : "sound/cat.mp3"},
                {name: "wolf", power: 3, source: "images/wolf2.png",sound : "sound/wolf.wav"},
                {name: "dog", power: 4, source: "images/dog2.png",sound : "sound/dog.wav"},
                {name: "leopard", power: 5, source: "images/leopard2.png",sound : "sound/leopard.wav"},
                {name: "tiger", power: 6, source: "images/tiger2.png",sound : "sound/tiger.flac"},
                {name: "lion", power: 7, source: "images/lion2.png",sound : "sound/lion.wav"},
                {name: "elephant", power: 8, source: "images/elephant2.png",sound : "sound/elephant.wav"},
                {name: "river", power: 0, source: "images/river.png",sound : ""},
                {name: "trap", power: 0, source: "images/trap2.png",sound : ""},
                {name: "den", power: 0, source: "images/den1.png",sound : "sound/win.wav"}, // P1 den 21
                {name: "den", power: 0, source: "images/den2.png",sound : "sound/win.wav"}] // P2 den 22
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// nxTurn ()
// This function executes the win message or next turn (regenerating board and switch player) based on the outcome input from MovementBfinal ()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const nxTurn = (outcome) => {
        console.log("nxTurn");
        //congtraluate player if it is a win
        if(outcome === "WinA"|| outcome === "WinB"){
                generateBoard();                // updates the board based on the updated Board array  
                playSound(21);
                messageTitle = "Game End";
                messageBody = `Player ${isA} win! Press reset to play again!`;
                updateModal();
                $('.modal').modal("show");
                playOnce = 0;                   //reinitialize to set game to restart
        }
        else if (outcome === "next") {
                // clears the board, change player turn and updates the screen
                // Switch player after each turn
                if(isA === "B"){isA = "A";}
                else if (isA === "A"){isA = "B"}; 
                $("#turn").text("Player "+ isA + "'s turn");
                playOnce = 1;
                generateBoard(); // updates the board based on the updated Board array  
        }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// executeMovement ()
// This function is called by getAnimal () and executes the change in values in the array and calls the nxTurn() for win message or next player turn
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const executeMovement = (currentCoordinate,nextCoordinate,validMove) => { 
        console.log("executeMovement");
        const cRow = currentCoordinate.row;
        const cCol = currentCoordinate.col;
        const nxRow = nextCoordinate.row;
        const nxCol = nextCoordinate.col;
        switch (validMove){ // different actions resulting from the earlier determined cases of move, a swop ie
                case "swop" :
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [game.Board[nxRow][nxCol],game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "jump" :
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [game.Board[nxRow][nxCol],game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "enterRiver":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [0,game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "exitRiver":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [9,game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "eat":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [0,game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "jumpeat":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [0,game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "exitTrapA":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [10,game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "exitTrapB":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [20,game.Board[cRow][cCol]];
                        nxTurn("next");
                        break;
                case "WinA":
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [20,game.Board[cRow][cCol]];
                        nxTurn("WinA");
                        break;
                case "WinB": 
                        [game.Board[cRow][cCol],game.Board[nxRow][nxCol]] = [10,game.Board[cRow][cCol]];
                        nxTurn("WinB");
                        break;
                default:
                        messageTitle = "Not a valid Move";
                        messageBody = "Please choose again!";
        }
  };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IsTrap ()
// This function is called by comparePowers() and will check if you are at the trap
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const IsTrap = (row,col) => {
        console.log("IsTrap")
        let trapPosition = 0;
        const trap_A = 1;
        const trap_B = 2;

        for (let i =0; i < trapArrA.length; i++){
            if (trapArrA[i][0] === row && trapArrA[i][1] === col){trapPosition = trap_A} // checking if next coord is player 1 trap 
        }
        for (let i =0; i < trapArrB.length; i++){
            if (trapArrB[i][0] === row && trapArrB[i][1] === col){trapPosition = trap_B} //checking if next coord is player 2 trap 
        }
        return trapPosition;
  };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IsRiver ()
// This function is called by comparePowers() and will check if you are at the just outside or inside the river
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const IsRiver = (row,col) => {
    console.log("IsRiver")
    const inRiver = 3;
    const outsideRiver = 4;
        let riverPosition = 0;
        for (let i =0; i < riverExitArr.length; i++){
                if (riverExitArr[i][0] === row && riverExitArr[i][1] === col){riverPosition = inRiver} // checking if coord ia inside river
                }
        for (let i =0; i < riverEntryArr.length; i++){
                if (riverEntryArr[i][0] === row && riverEntryArr[i][1] === col){riverPosition = outsideRiver} //checking if coord is outside river
                }
        return riverPosition;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// comparePowers ()
// This function is is called by checkNextCoordinate() used to compare the powers in relevant cases between current animal and items in the next box,
// whether can eat the next piece
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const comparePowers = (CoordinateArr, AnimalArr) => { 
        console.log("comparePowers")
        const cAnimal = AnimalArr[0];
        let powersOfCurrentAnimal = game.Animal[cAnimal].power;
        const nxAnimal = AnimalArr[1];
        const powersOfNextAnimal = game.Animal[nxAnimal].power;
        let trapPosition = 0;
        const cRow = CoordinateArr[0].row;
        const cCol = CoordinateArr[0].col;
        const nxRow = CoordinateArr[1].row;
        const nxCol = CoordinateArr[1].col;
        const elephant_A = 8;
        const elephant_B = 18;
        const rat_A = 1;
        const rat_B = 11;
        const trap_A = 10;
        const trap_B = 20;
        const atTrap_A = 1;
        const atTrap_B = 2;
        const inRiver = 3;
        const outsideRiver = 4;

        // Check for next move if it is a trap
        trapPosition = IsTrap(nxRow,nxCol);
        // This is to allow the animals to go into their own trap. But retains their power
        if(( cAnimal <= elephant_A && nxAnimal === trap_A) || ((cAnimal >= rat_B && cAnimal <= elephant_B) && nxAnimal === trap_B))
            {return "eat"}
        // If the animals are from different team
        else if(((cAnimal <= trap_A) && ((nxAnimal >= rat_B && nxAnimal <= trap_B))) || ((nxAnimal <= trap_A) && ((cAnimal >= rat_B && cAnimal <= trap_B)))){
        //compare powers 
                if      ((cAnimal === rat_A && nxAnimal === elephant_B) || (nxAnimal === elephant_A && cAnimal === rat_B)) 
                        {
                        if (IsRiver(cRow,cCol) === inRiver) {
                        messageTitle = "Exception Rule";
                        messageBody = `A ${game.Animal[cAnimal].name} in a river cannot move on a ${game.Animal[nxAnimal].name}. Please choose again!`;     
                        return ""}
                        else {return "eat"}
                        }
                else if ((cAnimal === elephant_A && nxAnimal === rat_B) || (nxAnimal === rat_A && cAnimal === elephant_B)) { 
                        messageTitle = "Exception Rule";
                        messageBody = `A ${game.Animal[cAnimal].name} cannot move on a ${game.Animal[nxAnimal].name}. Please choose again!`;
                            return "";
                        }
                else if (powersOfCurrentAnimal < powersOfNextAnimal ) {
                                messageTitle = "Not strong enough!";
                                messageBody = `A ${game.Animal[cAnimal].name} cannot move on a ${game.Animal[nxAnimal].name}. Please choose again!`;

                        if ((IsTrap(cRow,cCol) === atTrap_A && (cAnimal >= rat_B && cAnimal < trap_B)) || (IsTrap(cRow,cCol) === atTrap_B && cAnimal <= elephant_A)) 
                                {
                                        console.log(cAnimal,nxAnimal-10);
                                if      (cAnimal <= elephant_A){
                                        if (cAnimal >= (nxAnimal-10)) 
                                        {
                                        messageTitle = "Exception Rule!";
                                        messageBody = `${game.Animal[cAnimal].name} is weaken by the trap. Please choose again!`;
                                        }
                                        }
                                else if (cAnimal >= rat_B && cAnimal < trap_B){
                                        if ((cAnimal-10) >= nxAnimal) 
                                        {
                                        messageTitle = "Exception Rule!";
                                        messageBody = `${game.Animal[cAnimal].name} is weaken by the trap. Please choose again!`;
                                        }
                                        }
                                }
                                return "";
                        }
                else if (powersOfCurrentAnimal >= powersOfNextAnimal) {
                        if (trapPosition === atTrap_B && cAnimal <= elephant_A){
                                game.Animal[cAnimal].power = 0;           // when player 1 pieces step into player 2 trap, power drops to 0
                        }
                        else if (trapPosition === atTrap_A && (cAnimal >= rat_B && cAnimal < trap_B)){
                                game.Animal[cAnimal].power = 0;              // when player 2 pieces step into player 1 trap, power drops to 0
                        }
                        else if ((cAnimal === rat_A && nxAnimal === rat_B) || (cAnimal === rat_B && nxAnimal === rat_A))
                                {       if (IsRiver(cRow,cCol) === inRiver)     // rat cannot eat rat when it is in a river, otherwise all else ok
                                        {
                                        messageTitle = "Exception Rule";
                                        messageBody = `A ${game.Animal[cAnimal].name} in a river cannot move on a ${game.Animal[nxAnimal].name}. Please choose again!`;    
                                        return ""
                                        }
                                        else if ((trapPosition === atTrap_A) || (trapPosition === atTrap_B)) 
                                        {
                                        return "eat"
                                        }
                                        else if (IsRiver(cRow,cCol) === outsideRiver){
                                        return "eat"
                                        }
                                        return "eat"
                                }
                        else if (((IsTrap(cRow,cCol) === atTrap_A) && (cAnimal <= elephant_A))) {
                                return "exitTrapA";
                        }
                        else if ((IsTrap(cRow,cCol) === atTrap_B) && (cAnimal >= rat_B && cAnimal < trap_B)){
                                return "exitTrapB";
                        }
                        return "eat";
                };                                      // this will return eat regardless since the powers of animal 1 > animal 2, including trap and den
        }
        else    {
                messageTitle = "Not a valid Move";
                messageBody = "Please choose again!";
                return ""
                };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// moveForward ()
// The next 8 functions is called by getAnimal(), will calculate the next coordinate 
// Check if the coordinate is out of board
// it will then push the coordinates into the highlight array to complete the coordinates to be highlighted to show next possible moves
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const moveForward = (coordinate) => {
        console.log("moveForward");
        nxCoord = { row: coordinate.row - 1, col: coordinate.col};
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const moveBack = (coordinate) => {
        console.log("moveBack");
        nxCoord = { row: coordinate.row + 1, col: coordinate.col};
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const moveLeft = (coordinate) => {
        console.log("moveLeft");
        nxCoord = { row: coordinate.row, col: coordinate.col - 1 };
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const moveRight = (coordinate) => {
        console.log("moveRight");
        nxCoord = { row: coordinate.row, col: coordinate.col + 1 };
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const jumpForward = (coordinate) => { // for 6 tiger and 7 lion only
        console.log("jumpForward");
        nxCoord = { row: coordinate.row - 4, col: coordinate.col };
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const jumpBack = (coordinate) => {
        console.log("jumpBack");
        nxCoord = { row: coordinate.row + 4, col: coordinate.col};
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const jumpLeft = (coordinate) => {
        console.log("jumpLeft");
        nxCoord = { row: coordinate.row, col: coordinate.col - 3 };
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};

const jumpRight = (coordinate) => {
        console.log("jumpRight");
        nxCoord = { row: coordinate.row, col: coordinate.col + 3 };
        isOut = out(nxCoord);
        if(isOut){nxCoord.row = 100;nxCoord.col = 100}
        else {highlight.push(nxCoord)};
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// playSound function () is called by getAnimal() and generateBoard()
// This function will intro a new source attribute of audio by recieving the animal input and play the repective sound
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const playSound = (animal) => {
        console.log("playSound");
        let obj = $('<audio>').attr("src",game.Animal[animal].sound);
        obj[0].volume = 0.1;
        obj[0].play();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// out function () is check if the coordinate calculated by the getAnimal function is within the constraints of the board 9 (rows) x 7 (cols)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const out = (coordinate) => {
        console.log("out");
        if (coordinate.row > 8 || coordinate.row < 0 || coordinate.col <0 || coordinate.col > 6 )
                {return true}
        else    {return false}
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getOrder function ()
// Determines the orders (validMove) and returns it so that the next getOrder function () can execute the order
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getOrder = (CoordinateArr, AnimalArr) => { 
        console.log("getOrder");
        const cRow = CoordinateArr[0].row;
        const cCol = CoordinateArr[0].col;
        const nxRow = CoordinateArr[1].row;
        const nxCol = CoordinateArr[1].col;
        const currentAnimal = AnimalArr[0];
        const nextItem = AnimalArr[1];
        let validMove ="";
        const spaceS = 0;
        const riverG = 9;
        const intrap_A = 1;
        const intrap_B = 2;
        const rat_A = 1;
        const rat_B = 11;
        const elephant_A = 8;
        const elephant_B = 18;
        const inRiver = 3;
        const outsideRiver = 4;
        const den_A = 21;
        const den_B = 22;
 
        switch (nextItem) {
            case spaceS: //this check is the item in the next move is a 0 ie empty space
                validMove = "swop";
                if (IsTrap(cRow,cCol) === intrap_A) { 
                        if ((currentAnimal >= rat_B) && (currentAnimal <= elephant_B)){game.Animal[currentAnimal].power = (currentAnimal -10)}
                        validMove = "exitTrapA"
                    }
                else if (IsTrap(cRow,cCol) === intrap_B) { 
                        if (currentAnimal <= elephant_A){game.Animal[currentAnimal].power = (currentAnimal)}
                        validMove = "exitTrapB"}
                else {
                    if (currentAnimal === rat_A || currentAnimal === rat_B){
                        if ( IsRiver(cRow,cCol) === inRiver) { validMove = "exitRiver"};
                    }
                }
                break; //

            case riverG: // check if the next move is a river (9), only rat can go in 1 and 11 are rats || 6 tiger & 7 lion can forward +/- 3 or +/-4 steps when crossing water 
                if (currentAnimal === rat_A || currentAnimal === rat_B){
                    validMove = "swop"; // if not in one of the special coordinates, its just a normal swop, if rat is outside the river, it can enter river
                    if ( IsRiver(cRow,cCol) === outsideRiver) { validMove = "enterRiver"};
                }
                break;

            case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 20:
                if(IsRiver(cRow,cCol) === outsideRiver && IsRiver(nxRow,nxCol) === inRiver) { // for any other animal trying to enter the river to eat the rat
                    if (currentAnimal !== rat_A || currentAnimal !== rat_B  ){  
                        MessageHeader = "Wrong Selection";
                        MessageBody =`A ${currentAnimal} cannot enter river`;    // if the current selected animal is not a rat 
                        validMove ="";                    }    
                        }          // "" means not valid move    
                        validMove = comparePowers(CoordinateArr, AnimalArr);   // all else will go and compare power to decide on the next move
                break;

            case den_A: // Entering into Player 1 den, only allowing player 2
                if (currentAnimal >= rat_B && currentAnimal <= elephant_B){validMove = "WinB";}
                else {messageTitle = "Wrong selection"
                      messageBody = `You cannot enter into your own den. Please select again!`
                      validMove ="";
                }
                break;

            case den_B: // Entering into player 2 den, only allowing player 1 
                if (currentAnimal <= elephant_A){validMove = "WinA";}
                else {messageTitle = "Wrong selection"
                      messageBody = `You cannot enter into your own den. Please select again!`
                      validMove ="";
                }
                break;

            default:
                validMove ="";
        }
        return validMove;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// isArdRiver function () is called by getAnimal function triggered by button click on the animals
// It will recieve the rol and col of the animal selected and check if the animal is at horizontal section of the river
// or it is at the vertical section of the river, it will then return a 3 and 4 repectively
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const isArdRiver = (row,col) => {
        console.log("isArdRiver");
        let riverPosition = 0;
        const onHorizonBank = 3;
        const onVerticalBank = 4;
        for (let i =0; i < ardRiverHorizonArr.length; i++){
                if (ardRiverHorizonArr[i][0] === row && ardRiverHorizonArr[i][1] === col){riverPosition = onHorizonBank} // checking if next coord is player 1 trap 
        }
        for (let i =0; i < ardRiverVerticalArr.length; i++){
                if (ardRiverVerticalArr[i][0] === row && ardRiverVerticalArr[i][1] === col){riverPosition = onVerticalBank} //checking if next coord is player 2 trap 
        }
        return riverPosition;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// playerWrongChoice function ()
// emptys the respective temp arr and recommends player to choose again
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const playerWrongChoice =() => {
        console.log("playerWrongChoice");
        console.log(CoordinateArr);
        CoordinateArr = [];
        AnimalArr = [];
        highlight = [];
        generateBoard();
        step1 = true;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getAnimal function () 
// Triggered by button click on the animals. It is the mainbody of the actions of the game play.
// 1. This function finds out the row and column index of the selected animal based on the game Board array 
// 2. Checks if the animal follows the turn of the player, flag if not and player has to choose again
// 3. Will call other functions like moveForward,moveBack,moveRight etc to calculate the next coordinates.
// 4. Highlight the cells (possible move) being calculated. Disable the click events for other cells so user will not accidentally click on them.
// 5. User will then select the next move, call a function MovementB() to get the orders(validMove = swop) and MovementBFinal() to execute the order
// 6. The board will be refresh by calling on generateBoard()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAnimal = (event) => {
        console.log("getAnimal");
        // Initialize the variables
        let animal = {row: 0 , col: 0, nextMove: "", value: 0};
        let nxAnimal = {row: 0 , col: 0, nextMove: "", value: 0};
        let currentCoordinate = {row: 0, col: 0};
        let nxCoordinate = {row: 0, col: 0};
        let gridColor ="";
 
        // This part is when you click on an animal for the first time to select the animal
        if (step1 === true){
        animal.row = parseInt($(event.currentTarget).parent().attr("id"));
        animal.col = parseInt($(event.currentTarget).attr("id"));
        animal.value = game.Board[animal.row][animal.col];
        currentCoordinate.row = animal.row;
        currentCoordinate.col = animal.col;
        const trapA = 10;
        const trapB = 20;
        const denA = 21;
        const denB = 22;
        const riverG = 9;
        const spaceS = 0;
        const horizonBank = 3;
        const verticalBank = 4;
        const rat_A = 1;
        const rat_B = 11;
        const tiger_A = 6;
        const tiger_B = 16;
        const lion_A = 7;
        const lion_B = 17;

            // This part is to check if you accidentally chose 10,20- trap, 21,22 - den, 0 -space to move, t will flag cannot move, choose another
                if (animal.value === trapA || animal.value === trapB || animal.value === denA || animal.value === denB || animal.value === riverG || animal.value === spaceS) 
                {
                        messageTitle = "Wrong selection";
                        messageBody = `A ${game.Animal[animal.value].name} cannot be moved. Please choose again!`;
                        updateModal();
                        $('.modal').modal("show");
                        playerWrongChoice();
                        return;
                };

            // This part is to check that if you try to skip turn, an alert will flag and the right player will need to choose again
                if ((isA === "A") && (animal.value > trapA &&  animal.value < trapB))
                { 
                        messageTitle = "Wrong Turn";
                        messageBody = `It should be player ${isA}'s turn. Please select again!`;
                        //alert("It's A's turn");
                        updateModal();
                        $('.modal').modal("show");
                        playerWrongChoice();
                        return;
                }
                else if ((isA === "B") && (animal.value < trapA))
                { 
                        messageTitle = "Wrong Turn";
                        messageBody = `It should be player ${isA}'s turn. Please select again!`;
                        updateModal();
                        $('.modal').modal("show");
                        playerWrongChoice();
                        return;
                };

            // This part will check for possible movement options for each animal selected and highlight in green, considering only out of bounds.
                if (isArdRiver(currentCoordinate.row,currentCoordinate.col) === horizonBank)    
                {
                        if (animal.value === rat_A || animal.value === rat_B)        
                                { 
                                    moveForward(currentCoordinate);
                                    moveRight(currentCoordinate);
                                    moveBack(currentCoordinate);
                                    moveLeft(currentCoordinate);
                                }
                        else if (animal.value === tiger_A || animal.value === lion_A || animal.value === tiger_B || animal.value === lion_B )
                            {  // if it is lion 7 and tiger 6, they can jump rather than move
                                if (currentCoordinate.row === 2) {
                                    jumpBack(currentCoordinate);
                                    moveForward(currentCoordinate);
                                    }
                                else if (currentCoordinate.row === 6) {
                                    jumpForward(currentCoordinate);
                                    moveBack(currentCoordinate);
                                    }
                                    moveRight(currentCoordinate);
                                    moveLeft(currentCoordinate);
                            }
                        else    // all other animals
                            {
                                    if (currentCoordinate.row === 2) {
                                    moveForward(currentCoordinate);
                                    moveRight(currentCoordinate);
                                    moveLeft(currentCoordinate);
                                    }
                                    else if (currentCoordinate.row === 6) {
                                    moveRight(currentCoordinate);
                                    moveBack(currentCoordinate);
                                    moveLeft(currentCoordinate);
                                    }
                            }
                }
                else if ( isArdRiver(currentCoordinate.row,currentCoordinate.col) === verticalBank)
                { 
                        if (animal.value === rat_A || animal.value === rat_B) 
                            { 
                                    moveForward(currentCoordinate);
                                    moveRight(currentCoordinate);
                                    moveBack(currentCoordinate);
                                    moveLeft(currentCoordinate);
            
                            }
                        else if (animal.value === tiger_A || animal.value === lion_A || animal.value === tiger_B || animal.value === lion_B )
                            {  
                                    if (currentCoordinate.col === 0) {
                                    jumpRight(currentCoordinate);
                                    moveLeft(currentCoordinate);
                                    }
                                    else if (currentCoordinate.col === 3) {
                                    jumpRight(currentCoordinate);
                                    jumpLeft(currentCoordinate);
                                    }
                                    else if (currentCoordinate.col === 6){
                                    moveRight(currentCoordinate);
                                    jumpLeft(currentCoordinate);
                                    }
                                    moveForward(currentCoordinate);
                                    moveBack(currentCoordinate);
                            }
                        else 
                            { // all other animals
                                if (currentCoordinate.col === 0) {
                                    moveLeft(currentCoordinate);
                                }
                                else if (currentCoordinate.col === 3) {
                                }
                                else if (currentCoordinate.col === 6){
                                    moveRight(currentCoordinate);
                                }
                                    moveForward(currentCoordinate);
                                    moveBack(currentCoordinate);
                            }
                    }
                else { 
                        // this part is to set for all other normal conditions
                        moveForward(currentCoordinate);
                        moveRight(currentCoordinate);
                        moveBack(currentCoordinate);
                        moveLeft(currentCoordinate);
                    }

                // This will part will highlight the respective possible moves by the selected animal on the first click referencing the highlight []. 
                // However, this does not provide logic on whether it can win over the other animal, the comparePowers () will provide that. 
                // So if you click on the animal that you cannot win or item that you cannot go into for eg own's den, then an alert will prompt you to choose again
                
                if (isA === "A") {gridColor = "#34eb46"}
                else if (isA === "B") {gridColor = "#eb3486"}
                for (let i = 0; i < highlight.length; i++){
                        $(`.gameRowRef[id='${highlight[i].row}'] > .gameColRef[id='${highlight[i].col}']`).css("border",`5px solid ${gridColor}`);}
                        step1 = false;            // This line is to allow to move to the next step of selecting the destination move

                // This part is to turn off the click event for all cells
                for (let i = 0; i < game.Board.length; i++) {
                        for (let j = 0; j < game.Board[0].length; j++) {
                        $(`.gameRowRef[id='${i}'] > .gameColRef[id='${j}']`).off();
                        }
                }
                // This part is to turn on the click event for only cells corresponding to the next possible moves 
                // so that user will not be able to randomly click on other cells other than those suggested.
                for (let i =0; i <  highlight.length;i++){
                        $(`.gameRowRef[id='${highlight[i].row}'] > .gameColRef[id='${highlight[i].col}']`).on("click",(event) => {getAnimal(event)});
                }

                CoordinateArr.push(currentCoordinate); 
                AnimalArr.push(animal.value);
        }
        else if (step1 === false){ 
        // This means is the second step of the selection, ie where to move next based on possible solutions highlighted earlier
        // This part will retrieve the row and col of the selected cell, and its value from the game.Board array
        // It will then push the retrieved coordinates and animal (value 1 or 2 etc) into the CoordinateArr and AnimalArr
        // Call the getOrder function using the CoordinateArr and AnimalArr to return the orders (validMove) on how to move forward (swop,eat etc)
        // If the order (validMove) is blank, it will flag a not valid move, and ask user to choose again
        // but if the order (validMove) is not blank, call MovementBFinal() with current coordinates, next Coordinates, order.
        // MovementBFinal() function will change the values in the game.Board array values according to the orders given.
        // Will play the sound of the animal moved
        // Then empty the CoordinateArr,CoordinateArr,highlight so that the next animal selection can reuse the variables
        // GenerateBoard to render the game.Board array on the screen
        // Turn the step1 counter to true so that we know it is go back to first step

                nxAnimal.row = parseInt($(event.currentTarget).parent().attr("id"));
                nxAnimal.col = parseInt($(event.currentTarget).attr("id"));
                nxCoordinate.row = nxAnimal.row;
                nxCoordinate.col = nxAnimal.col;
                nxAnimal.value = game.Board[nxAnimal.row][nxAnimal.col];
                CoordinateArr.push(nxCoordinate);
                AnimalArr.push(nxAnimal.value);
                console.log(CoordinateArr);
                console.log(AnimalArr);
                validMove = getOrder(CoordinateArr,AnimalArr);
                if (validMove !== ""){
                        executeMovement(CoordinateArr[0],CoordinateArr[1],validMove);
                        playSound(AnimalArr[0]);
                }
                else if (validMove === "") {
                        updateModal();
                        $('.modal').modal("show");
                        playerWrongChoice();
                };
                step1 = true;
                CoordinateArr = [];
                AnimalArr = [];
                highlight = [];
        }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// generateBoard function ()
// Empty the contents of main game board div - gameBoardMain and show the corresponding content that is linked to the ID number in the Board array
// For example, at the start, ID 1 (rat) in the game.Board array is at game.Board[6][6]. 
// Will show the img of the rat by referring to the game.Animal array using game.Animal[game.Board[6][6]].
// Will attach an on click event listener to the cell (div)
// This will also show the Player B and Player A in here to show side of the chess board
// Generates the body of the game board 9 (rows) x 7 (columns).
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const generateBoard = () => {
        console.log("generateBoard");
        if (playOnce === 0) {playSound(0)};
        const $body = $("body");
        $(".gameBoardMain").empty(); // refreshes the body
        $(".gameBoardMain").append($("<h7>").text("Player B"));
        for (let i = 0; i < game.Board.length; i++) {
                const $row = $("<div>");
                $row.addClass("gameRowRef").attr("id", `${i}`);
                for (let j = 0; j < game.Board[0].length; j++) {
                    const $cell = $("<div>");
                    $cell.addClass("gameColRef").attr({id: `${j}`}).on("click",(event) => {getAnimal(event)});
                    $cell.append($('<img>').attr("src", game.Animal[game.Board[i][j]].source));
                    $row.append($cell);
                }
                $(".gameBoardMain").append($row);
        }
        $(".gameBoardMain").append($("<h7>").text("Player A"));
        $body.append($(".gameBoardMain"));
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// refreshBoard function ()
// This function reinitiate back to the original starting positions of the pieces after a reset by player by
// assigning the original array in game board 2 into game Board
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const refreshBoard =() => {
        console.log("refreshBoard");
        for (let i = 0; i < game.Board2.length;i++){
                for (let j = 0; j < game.Board2[i].length;j++){
                    game.Board[i][j] = game.Board2[i][j];
                }
        }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// gameRules function ()
// This function will show the game rules and a proceed button after reading the game rules by calling render()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const gameRules = () => {
        console.log("gameRules");
        const $body = $("body");
        playOnce = 2;
        $(".gameBoardMain").empty(); // refreshes the body
        $(".gameBoardMain").append($("<br>"));
        $(".gameBoardMain").append($("<div>").addClass("mainDiv").css({"border" :"1px solid white","width" : "780px","margin": "0 auto"}));
        $(".mainDiv").append($("<br>"));
        $(".mainDiv").append($("<h3>").text("Game Rules").css("text-decoration","underline"));
        $(".mainDiv").append($("<h6>").text("1. Each piece has A or B indicated on the top left corner, indicating which player's animal"));
        $(".mainDiv").append($("<h6>").text("2. Each animal has a power (1-8) shown on the top right corner"));
        $(".mainDiv").append($("<br>"));
        $(".mainDiv").append($('<img>').attr("src", game.Animal[11].source).css("width","100px"));
        $(".mainDiv").append($('<div>').addClass("second").css({"width": "25px", "height": "25px", "background-color": "black"}));
        $(".mainDiv").append($("<h6>").text("3. The animal with higher or equal powers will win against their opponent"));
        $(".mainDiv").append($("<br>"));
        $(".mainDiv").append($('<div>').addClass("top"));
        $(".top").append($('<img>').addClass("first").attr("src", game.Animal[7].source).css("width","100px"));
        $(".top").append($('<div>').addClass("second").css({"width": "80px", "height": "80px", "background-color": "black","font-size" : "40px"}).text(">"));
        $(".top").append($('<img>').addClass("third").attr("src", game.Animal[12].source).css("width","60px"));
        $(".mainDiv").append($("<br>"));
        $(".mainDiv").append($("<h6>").text("4. Only exception is Rat (power 1) will triumph against Elephant (power 8)"));
        $(".mainDiv").append($("<h6>").text("5. Each animal can only move one step (not diagonally) at a time per turn"));
        $(".mainDiv").append($("<h6>").text("6. Only exception is tiger (power 6) and lion (power 7) can jump across river banks"));
        $(".mainDiv").append($("<h6>").text("7. Only rat can enter the river"));
        $(".mainDiv").append($("<h6>").text("8. The trap will weaken the opponent's power"));
        $(".mainDiv").append($("<h6>").text("9. To win, your animal has to enter the opponent's den"));
        $(".mainDiv").append($("<br>"));
        $(".mainDiv").append($("<button>").addClass("btn btn-danger btn-sm").text("Proceed").on("click", render)); // Proceed to close the game rules
        $(".mainDiv").append($('<div>').addClass("second").css({"width": "25px", "height": "25px", "background-color": "black"}));
        $body.append($(".gameBoardMain"));

};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// updateModal function () provides prompt
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateModal = () => {
        console.log("updateModal");
        const modalDiv = $('.modal');
        modalDiv.empty();
        modalDiv.append($('<div class="modal-dialog modal-dialog-centered" role="document">'));
        $('.modal-dialog').append($(' <div class="modal-content">'));
        $('.modal-content').append($('<div class="modal-header">'));
        $('.modal-header').append($(`<h5 class="modal-title">${messageTitle}</h5>`));
        $('.modal-content').append($(`<div class="modal-body">${messageBody}</div>`));
        $('.modal-content').append($('<div class="modal-footer">'));
        $('.modal-footer').append($('<button type="button" class="btn btn-primary">Close</button>').on("click",()=>{$('.modal').modal("hide")}));
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// intro function () Showing Game name and a start button
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const intro = () => {
        console.log("intro");
        const $body = $("body");
        $body.empty(); // refreshes the body
        $body.append($("<div>").addClass("gameBoardMain")); 
        $('.gameBoardMain').append($("<div>").addClass("letterMain1"));
        $('.letterMain1').append($("<div>").addClass("titleMain").text("Dou Shou Qi").css({"font-size":"120px", "display":"none"}));
        $('.gameBoardMain').append($("<button>").addClass("btn btn-info btn-sm sg").text("Start Game").on("click", render).css({"background-color": "#99d0f2","color":"black","width": "100px"}));
        $('.sg').hide();
        $(".titleMain").fadeIn(4000);
        $('.sg').delay(3000).fadeIn();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// render function ()
// This function display the opening page of the Game displaying only the name of the game and the menu options available
// Displays generate board button (calls generateBoard function), reset button (calls render function), game rules button (calls gameRules function) 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const render = () => {
        console.log("render");
        if (playOnce === 2)                      // after game start playonce turn to 2, this is for allowing to check game rules again during game
        {generateBoard();                        // regnerate board after player proceeds after reading rules
        playOnce = 0;                            // turn playOnce to 0 so that can reset the game whenever needed. nxTurn will turn it to 1 when game in play again
        }                   
        else{
        const $body = $("body");
        $body.empty(); // refreshes the body
        playOnce = 0;  
        refreshBoard();
        // displays the screen and menu buttons
        isA = "A";
        $body.append($("<h2>").text("Dou Shou Qi"));
        $div = $("<div>").addClass("Menu");
        $div.append($("<button>").addClass("btn btn-info btn-sm").attr("id", "generate").text("Start New Game").css("width", "200px").on("click",generateBoard)); //Press to make new game
        $div.append($("<button>").addClass("btn btn-danger btn-sm").text("Reset Game").on("click", render).css({"background-color": "pink","color":"black","width": "200px"})); // Reset any point of time
        $div.append($("<button>").addClass("btn btn-info btn-sm").text("Game Rules").css({"background-color": "#f5d742","width": "200px"}).on("click",gameRules)); // Keep score of Player 1
        $div.append($("<button>").addClass("btn btn-danger btn-sm").attr("id", "turn").css({"background-color": "#lightred","width": "200px"}).text("Player "+ isA + "'s turn")); // Let's you know whose turn it is
        $body.append($div);
        $body.append($("<div>").addClass("gameBoardMain")); 
        $body.append($('<div class="modal fade" aria-hidden="true">'));
        updateModal();
        }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// playBackgroundMusic function ()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const playBackgroundMusic = () => {
        console.log("playBackgroundMusic");
        let obj = $('<audio>').attr({src : game.Animal[9].sound, muted : true});
        obj[0].loop = true;
        obj[0].playbackRate = 0.9;
        obj[0].volume = 0.02;
        obj[0].play();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const main = () => {
        playBackgroundMusic();
        intro();
};

$(main);
