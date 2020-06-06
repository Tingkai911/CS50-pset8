document.addEventListener('DOMContentLoaded',() => {
    // tutorial from https://www.youtube.com/watch?v=rAUn1Lom6dw&t=1757s
    // All code must be written between these 2 parenthesis so that it can be picked up in the html file

    // everythime we do something to grid it will affect the element with class name .grid in html code
    const grid = document.querySelector(".grid");

    // JS to talk to all the div inside the element with the class name .grid
    // each grid have an array number
    let squares = Array.from(document.querySelectorAll(".grid div"));
    console.log(squares);

    // use # to say that we are looking for an ID
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-button");
    let timerId;
    let score = 0;

    const width = 10;
    let nextRandom = 0;

    // The Tetrominoes based on the index number
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    console.log(theTetrominoes);

    let currentPosition = 4;
    let currentRotation = 0;

    // randomly select the tetrominoes and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    console.log(random);
    let current = theTetrominoes[random][currentRotation];

    // draw the tetromino
    function draw()
    {
        current.forEach(
            index => {squares[currentPosition + index].classList.add('tetromino')} //classLIst.add to access the CSS stylesheet
            );
    }

    // undraw the tetromino
    function undraw()
    {
        current.forEach(
            index => {squares[currentPosition + index].classList.remove('tetromino')}
            );
    }

    // move the tetromino down every second
    // timerId = setInterval(moveDown, 1000);

    //assign functions to keyCodes
    function control(e)
    {
        if(e.keyCode === 37)
        {
            moveLeft();
        }
        else if (e.keyCode === 38)
        {
            rotate();
        }
        else if (e.keyCode === 39)
        {
            moveRight();
        }
        else if (e.keyCode === 40)
        {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    // move down function
    function moveDown()
    {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // freeze function
    function freeze()
    {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken')))
        {
            //change the class of the tetromino to taken
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move the tetromino left unless at the edge or there is a blockage
    function moveLeft()
    {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0);

        if(!isAtLeftEdge)
        {
            currentPosition -= 1;
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition += 1;
        }
        draw();
    }

    // move the tetromino right unless at the edge of there is a blockage
    function moveRight()
    {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index)%width === width - 1);
        if(!isAtRightEdge)
        {
            currentPosition += 1;
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition -= 1;
        }
        draw();
    }

    // rotate the tetromino
    function rotate()
    {
        undraw();
        currentRotation ++;
        // if current rotation gets to 4, make it go back to 0
        if(currentRotation === current.length)
        {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        checkRotatedPosition();
        draw();
    }

    ///FIX ROTATION OF TETROMINOS A THE EDGE
    function isAtRight()
    {
        return current.some(index=> (currentPosition + index + 1) % width === 0);
    }

    function isAtLeft()
    {
        return current.some(index=> (currentPosition + index) % width === 0);
    }

    function checkRotatedPosition()
    {
        if ((currentPosition+1) % width < 4) //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
        {
            if (isAtRight())
            {                               //use actual position to check if it's flipped over to right side
                currentPosition += 1;       //if so, add one to wrap it back around
                checkRotatedPosition();     //check again.  Pass position from start, since long block might need to move more.
            }
        }

        else if (currentPosition % width > 5)
        {
            if (isAtLeft())
            {
                currentPosition -= 1;
                checkRotatedPosition();
            }
        }
    }

    //show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //the tetrominos without rotations
    const upNextTetrominos = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
        [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
        [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ];

    //display the shape in the mini-grid display
    function displayShape()
    {
        // remove any trace of tetromino from the entire grid
        displaySquares.forEach(square => square.classList.remove('tetromino'));
        upNextTetrominos[nextRandom].forEach(index => displaySquares[displayIndex + index].classList.add('tetromino'));
    }

    // add functionality to the button
    startBtn.addEventListener("click", () =>
    {
        // when we click the button and moveDown is running, we want to stop
        if(timerId)
        {
            clearInterval(timerId);
            timerId = null;
        }
        // when we click the button and moveDown is not running, we want to start
        else
        {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    });

    //add score
    function addScore()
    {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken')))
            {
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                  squares[index].classList.remove('taken');
                  squares[index].classList.remove('tetromino');
                  squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver()
    {
        // if there is already a block in the orginial default position of currentPosition = 4, then it is game over
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
          scoreDisplay.innerHTML = 'end';
          clearInterval(timerId);
        }
    }

})