document.addEventListener("DOMContentLoaded", function () {
    // Hide Game Screen
    document.getElementById("game-screen").style.display = "none";

    let playerXScore = 0;
    let playerOScore = 0;

    // Score Board
    document.getElementById("player-x-score").innerHTML = "X: " + playerXScore;
    document.getElementById("player-o-score").innerHTML = "O: " + playerOScore;

    // "Next Round" button
    const nextRoundButton = document.getElementById("next-round");

    // "Play Again" button
    const playAgainButton = document.getElementById("play-again");

    let isEasyAI = false; // Flag to check if Easy AI is active
    let isDifficultAI = false; // Flag to check if Difficult AI is active

    // "Play Game" button for Human
    document.getElementById("human").addEventListener("click", function () {
        if (!isEasyAI && !isDifficultAI) {
            // Only proceed if neither Easy AI nor Difficult AI is active
            // Hide Home Screen
            document.getElementById("home-screen").style.display = "none";
            document.getElementById("game-screen").style.display = "block";
            resetGame();
            resetBoard();
            boardClickable = true;
            turn = "X"; // Ensure human starts first

            // If AI's turn, simulate AI move
            if (turn === "O" && isEasyAI) {
                easyAI();
            } else if (turn === "O" && isDifficultAI) {
                difficultAI();
            }
        }
    });

    // Add event listener for Easy AI option
    document.getElementById("easy").addEventListener("click", function () {
        isEasyAI = true; // Set the flag for Easy AI
        isDifficultAI = false; // Deactivate Difficult AI
        // Hide Home Screen
        document.getElementById("home-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";

        // Start the game with Easy AI as O
        resetGame();
        resetBoard();
        boardClickable = true;

        // Set turn to X explicitly for the human
        turn = "X";

        // If AI's turn, simulate Easy AI move
        if (turn === "O" && isEasyAI) {
            easyAI();
        }
    });

    // Add event listener for Difficult AI option
    document.getElementById("difficult").addEventListener("click", function () {
        isEasyAI = false; // Deactivate Easy AI
        isDifficultAI = true; // Set the flag for Difficult AI
        // Hide Home Screen
        document.getElementById("home-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";

        // Start the game with Difficult AI as O
        resetGame();
        resetBoard();
        boardClickable = true;

        // Set turn to X explicitly for the human
        turn = "X";

        // If AI's turn, simulate Difficult AI move
        if (turn === "O" && isDifficultAI) {
            difficultAI();
        }
    });


    // Add event listener for Expert AI option
    document.getElementById("expert").addEventListener("click", function () {
        isEasyAI = false; // DeactivateEasy AI
        isDifficultAI = false; // Deactivate Difficult AI
        isExpertAI= true // Set the flag for Expert AI
        // Hide Home Screen
        document.getElementById("home-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";

        // Start the game with Easy AI as O
        resetGame();
        resetBoard();
        boardClickable = true;

        // Set turn to X explicitly for the human
        turn = "X";

        // If AI's turn, simulate Easy AI move
        if (turn === "O" && isExpertAI) {
            expertAI();
        }
    });

    let boxes = document.querySelectorAll(".box");
    let turn = "X";
    let isGameOver = false;
    let boardClickable = true;

    boxes.forEach(e => {
        e.innerHTML = "";
        e.addEventListener("click", () => {
            if (!isGameOver && boardClickable && e.innerHTML === "") {
                e.innerHTML = turn;
                if (Win()) {
                    // Increment the score of the winner
                    if (turn === "X") {
                        playerXScore++;
                    } else {
                        playerOScore++;
                    }
    
                    // Update scores on the score board
                    document.getElementById("player-x-score").innerHTML = "X: " + playerXScore;
                    document.getElementById("player-o-score").innerHTML = "O: " + playerOScore;
    
                    if (playerXScore < 5 && playerOScore < 5) {
                        nextRoundButton.style.display = "inline";
                    }
    
                    // Check if a player reached 5 points
                    if (playerXScore === 5 || playerOScore === 5) {
                        isGameOver = true;
                        document.querySelector("#results").innerHTML = turn + " wins the game!";
                        playAgainButton.innerHTML = "Play Again";
                        playAgainButton.style.display = "inline";
                        nextRoundButton.style.display = "none";
                    }
    
                    boardClickable = false;
                } else {
                    Draw();
                    changeTurn();
                    // If AI's turn, simulate AI move
                    if (turn === "O" && isEasyAI) {
                        easyAI();
                    } else if (turn === "O" && isDifficultAI) {
                        difficultAI();
                    } else if (turn === "O" && isExpertAI) {
                        expertAI();
                    }
                }
            }
        });
    });
    

    function changeTurn() {
        if (turn === "X") {
            turn = "O";
            document.querySelector(".bg").style.left = "85px";
        } else {
            turn = "X";
            document.querySelector(".bg").style.left = "0";
        }
    }

    function easyAI() {
        // Simulate the Easy AI move
        if (!isGameOver && boardClickable) {
            let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
            if (emptyBoxes.length > 0) {
                // Choose a random empty box for the AI move
                let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
                let selectedBox = emptyBoxes[randomIndex];
                selectedBox.innerHTML = "O";

                if (Win()) {
                    // Highlight the winning cells
                    return;
                } else {
                    Draw();
                    changeTurn();
                }
            }
        }
    }

    function difficultAI() {
        // Simulate the Difficult AI move
        if (!isGameOver && boardClickable) {
            let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
            if (emptyBoxes.length > 0) {
                // Check for a winning move first
                let winningMove = findWinningMove("O");
                if (winningMove) {
                    winningMove.innerHTML = "O";
                } else {
                    // Check for a blocking move
                    let blockingMove = findWinningMove("X");
                    if (blockingMove) {
                        blockingMove.innerHTML = "O";
                        removeHighlight(); // Remove highlighting from all cells
                    } else {
                        // Choose a random empty box if no winning or blocking move
                        let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
                        let selectedBox = emptyBoxes[randomIndex];
                        selectedBox.innerHTML = "O";
                    }
    
                    if (Win()) {
                        // Highlight the winning cells
                        return;
                    } else {
                        Draw();
                        changeTurn();
                    }
                }
            }
        }
    }
    
    function removeHighlight() {
        // Remove highlighting from all cells
        boxes.forEach(box => {
            box.style.removeProperty("background-color");
            box.style.color = "#fff";
        });
    }

    function findWinningMove(player) {
        // Check for a winning move for the specified player
        let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
        for (let box of emptyBoxes) {
            box.innerHTML = player;
    
            // Check if the opponent ('X') has a winning move
            if (Win(player === 'O' ? 'X' : 'O')) {
                box.innerHTML = ""; // Reset the move
                return box;
            }
    
            box.innerHTML = ""; // Reset the move
        }
        return null;
    }

    function expertAI() {
        // Simulate the Difficult AI move
        if (!isGameOver && boardClickable) {
            let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
            if (emptyBoxes.length > 0) {
                // Check for a winning move first
                let winningMove = findWinningMove("O");
                if (winningMove) {
                    winningMove.innerHTML = "O";
                } else {
                    // Check for a blocking move
                    let blockingMove = findWinningMove("X");
                    if (blockingMove) {
                        blockingMove.innerHTML = "O";
                        removeHighlight(); // Remove highlighting from all cells
                    } else {
                        // Choose a random empty box if no winning or blocking move
                        let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
                        let selectedBox = emptyBoxes[randomIndex];
                        selectedBox.innerHTML = "O";
                    }
    
                    if (Win()) {
                        // Highlight the winning cells
                        return;
                    } else {
                        Draw();
                        changeTurn();
                    }
                }
            }
        }
    }
    
    function removeHighlight() {
        // Remove highlighting from all cells
        boxes.forEach(box => {
            box.style.removeProperty("background-color");
            box.style.color = "#fff";
        });
    }

    function findWinningMove(player) {
        // Check for a winning move for the specified player
        let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
        for (let box of emptyBoxes) {
            box.innerHTML = player;
    
            // Check if the opponent ('X') has a winning move
            if (Win(player === 'O' ? 'X' : 'O')) {
                box.innerHTML = ""; // Reset the move
                return box;
            }
    
            box.innerHTML = ""; // Reset the move
        }
        return null;
    }

function Win(){
    let winConditions = [

        //1st ROW WINS - HORIZONTAL
        [0, 1, 2], [3, 4, 5], [1, 2, 3], [2, 3, 4],  
        //2nd ROW WINS - HORIZONTAL
        [6, 7, 8], [9, 10, 11], [7, 8, 9], [8, 9, 10], 
        //3rd ROW WINS - HORIZONTAL
        [12, 13, 14], [15, 16, 17], [13, 14, 15], [14, 15, 16],
        //4th ROW WINS - HORIZONTAL
        [18, 19, 20], [21, 22, 23], [19, 20, 21], [20, 21, 22],
        //5th ROW WINS - HORIZONTAL
        [24, 25, 26], [27, 28, 29], [25, 26, 27], [26, 27, 28],

        //VERTICAL WINS 
        [0, 6, 12], [1, 7, 13], [2, 8, 14], [3, 9, 15],

        [4, 10, 16], [5, 11, 17], [6, 12, 18], [7, 13, 19],

        [8, 14, 20], [9, 15, 21], [10, 16, 22], [11, 17, 23],

        [12, 18, 24], [13, 19, 25], [14, 20, 26], [15, 21, 27],

        [16, 22, 28], [17, 23, 29],

        // DIAGONAL WINS
        // Top-left to bottom-right diagonals
        [0, 7, 14], [1, 8, 15], [2, 9, 16], [3, 10, 17], 

        [6, 13, 20], [7, 14, 21], [8, 15, 22], [9, 16, 23], [10, 17, 24],

        [12, 19, 26], [13, 20, 27], [14, 21, 28], [15, 22, 29],

        // Top-right to bottom-left diagonals
        [5, 10, 15], [4, 9, 14], [3, 8, 13], [2, 7, 12], 

        [11, 16, 21], [10, 15, 20], [9, 14, 19], [8, 13, 18], [7, 12, 17],

        [16, 21, 26], [15, 20, 25], [14, 19, 24], [13, 18, 23], [17, 22, 27],

    ]

    
    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            // Highlight the winning cells
            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#FF2E63";
                boxes[winConditions[i][j]].style.color = "#000";
            }
            return true; 
        }
    }
    return false; 
}


    function Draw() {
        if (!isGameOver) {
            let isDraw = true;
            boxes.forEach(e => {
                if (e.innerHTML === "") isDraw = false;
            });

            if (isDraw) {
                isGameOver = true;
                document.querySelector("#results").innerHTML = "Draw";
                nextRoundButton.style.display = "inline";
            }
        }
    }

    function resetGame() {
        // Reset turn to X
        turn = "X";
        document.querySelector(".bg").style.left = "0";

        // Reset the board
        resetBoard();
        boardClickable = true;
    }

    function resetBoard() {
        boxes.forEach(e => {
            e.innerHTML = "";
            e.style.removeProperty("background-color");
            e.style.color = "#fff";
        });
    }

    playAgainButton.addEventListener("click", () => {
        isGameOver = false;
        document.querySelector("#results").innerHTML = "";
        playAgainButton.style.display = "none";

        // Reset scores on the score board
        playerXScore = 0;
        playerOScore = 0;

        document.getElementById("player-x-score").innerHTML = "X: " + playerXScore;
        document.getElementById("player-o-score").innerHTML = "O: " + playerOScore;

        resetGame();
    });

    nextRoundButton.addEventListener("click", () => {
        // Reset the board for the next round
        resetBoard();
        nextRoundButton.style.display = "none";
        isGameOver = false;
        document.querySelector("#results").innerHTML = "";

        resetGame();
        boardClickable = true;
    });
});

//AI FUNCTIONS WALA
