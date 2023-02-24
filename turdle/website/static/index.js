// Here is where several important variables are defined.

/**
 * The HTML element that contains our rows.
 */
const GameBoard = document.getElementById("GameBoard");

/**
 * Get today's word and start the game.
 */
const startup = async function () {
    let response = await fetch('https://oscarmalan-turdle-api-master.k1.zportal.co.uk/');
    let word = await response.text();
    startGame(word.toUpperCase());
};

/**
 * Start the game!
 * 
 * @param {string} word Today's word
 */
const startGame = function (word) {

    /**
     * Array of letters in today's word.
     */
    const Letters = word.split("");

    /**
     * Current box in row (not zero indexed).
     */
    let Number_Box_of_Row = 1;

    /**
     * Current row index.
     */
    let Current_Row = 0;

    /**
     * Whether the last key entered was a Backspace.
     */
    let Clicked_Backspace = false;
    
    /**
     * Number of attempts that the user is allowed to have.
     */
    const Number_of_Attempts = 6;

    /**
     * Number of letters per attempt.
     */
    const Letter_Per_Word = 5;

    /**
     * Build the game board!
     * 
     * This means inserting rows and boxes into our HTML.
     */
    for (let i = 0; i != Number_of_Attempts; i++)
    {
        const Row = document.createElement("div");
        /* class is an id that can be referred to multiple times.
        *  We are using a class since there are multiple rows */
        Row.classList.add("Box_Row");
        /* Loops to set up the amount of boxes per
        attempt (number of letters) */
        for (let i = 0; i != Letter_Per_Word; i++)
        {
            const Box = document.createElement("div");
            Box.classList.add("Box_Shape");
            // Dataset stores any kind of data, it can be dataset.x
            Box.dataset.value = "";
            Row.appendChild(Box);
        }
        GameBoard.appendChild(Row);
    }

    /* Js is an event driven language, this checks if a key
    has been pressed. function(Event) is Js telling us anything
    that is happening.*/

    /**
     * Background music.
     */
    const Play_General = document.getElementById("General_Song");
    
    /**
     * Run this function everytime a key is pressed.
     * 
     * @param {KeyboardEvent} Event What key the user has entered.
     */
    const Handle_Key_Press = function(Event){
        /**
         * The previous box that the user typed into.
         */
        const Previous_Box = document.getElementsByClassName('Box_Row')[Current_Row].children[Number_Box_of_Row - 2];

        /**
         * The next empty box.
         */
        const Next_Empty_Box = Get_Next_Empty_Box();
        // Plays the background audio
        Play_General.play();

        /**
         * If this is our final letter for this row, and the user clicked
         * any key except Backspace...
         */
        if (Number_Box_of_Row === 6 && Event.key !== 'Backspace')
        {
            /**
             * If the user has clicked 'Enter', we need to check if they
             * got it correct.
             */
            if (Event.key === 'Enter') {
                /**
                 * Every box in the current row.
                 */
                const Boxes_In_Row = document.getElementsByClassName('Box_Row')[Current_Row].children;
    
                /**
                 * Number of correct letters in the correct place in this row.
                 */
                let Number_of_Letters_Done_in_One_Attempt = 0;
    
                /**
                 * Run through each letter in this row and check it.
                 */
                for (let i = 0; i != Boxes_In_Row.length; i++)
                {
                    /**
                     * The current box we are checking in this row.
                     */
                    const Box = Boxes_In_Row[i];
    
                    /**
                     * If the box that we're on now contains the correct letter
                     * in the correct place.
                     */
                    if (Box.dataset.value == Letters[i])
                    {
                        Box.style.background = 'green';
                        Number_of_Letters_Done_in_One_Attempt++;
                    }
                    /**
                     * Otherwise, we need to check all the other word letters
                     * to see if it's correct but in the wrong place.
                     */
                    else
                    {
                        /**
                         * Whether the letter is correct, but in the wrong place.
                         * This stops the box turning brown again later.
                         */
                        let Half_Ass_Right = false;
                        
                        for (let j = 0; j != Letters.length; j++)
                        {
                            /**
                             * If the letter is in the word, but in the wrong place.
                             */
                            if (Box.dataset.value == Letters[j])
                            {
                                // Makes the box dark yellow and sets a variables
                                Box.style.background = '#b59f3b';
                                Half_Ass_Right = true;
                            }
                            else
                            {
                                /**
                                 * If we haven't already made the box yellow,
                                 * let's make it brown!
                                 */
                                if (Half_Ass_Right == false)
                                {
                                    // Makes the box brown
                                    Box.style.background = '#381a02';
                                }
                            }
                        }
                    }
                }
    
                /**
                 * Did we get all the letters correct and in the right place?
                 * 
                 * If yes, we won the game!
                 */
                if (Number_of_Letters_Done_in_One_Attempt == 5)
                {
                    // Set up a win screen here
                    const Win_Screen = document.getElementById("Win_Screen");
                    Win_Screen.classList.add("Win_Screen");
                    Win_Screen.innerText = "You Won!!!!!"
                    const Play_Win = document.getElementById("Win_Song");
                    Play_General.pause();
                    Play_Win.play();
                    // Ends the game
                    document.removeEventListener('keydown', Handle_Key_Press)
                }
                /**
                 * Did we not get it yet? Let's move on to the next attempt.
                 */
                else
                {
                    /**
                     * Are we already on our last attempt?
                     * If yes, we lost the game!
                     */
                    if (Current_Row == 5)
                    {
                        // Set up a lose screen here
                        const Lose_Screen = document.getElementById("Lose_Screen");
                        Lose_Screen.classList.add("Lose_Screen");
                        Lose_Screen.innerText = "You Lost!!!!!";
                        const Play_Lose = document.getElementById("Lose_Song");
                        Play_General.pause();
                        Play_Lose.play();
                        // Ends the game
                        document.removeEventListener('keydown', Handle_Key_Press);
                    }
                    /**
                     * We're not on our last attempt yet! Continue the game.
                     */
                    else
                    {
                        // Go to the next row!
                        Current_Row++;
        
                        // Reset box number for next row.
                        Number_Box_of_Row = 1;
                    }
                }
            }
        }

        else if (Number_Box_of_Row - 1 != 0 && Event.key=="Backspace")
        {
            /* Psuedo code
            When the user types enter, the previous box must be emptied
            and then have the current box set to that box. */
            // empty previous box.
            Number_Box_of_Row--;
            Previous_Box.dataset.value = "";
        }

        /* Checks if the input is a letter, if not sets the input
        as an empty string */
        else if (Event.key.match(/^[a-zA-Z]{1}$/))
        {
            Next_Empty_Box.dataset.value = Event.key.toUpperCase();
            Number_Box_of_Row++;
        }
    };

    document.addEventListener("keydown", Handle_Key_Press);
    const Get_Next_Empty_Box = function(){
        const Boxes = document.getElementsByClassName("Box_Shape")
        for (let i = 0; i != Boxes.length; i++)
        {
            if (Boxes[i].dataset.value === "")
            {
                return Boxes[i];
            }
        }
    };
};

startup();