document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const carrier = document.querySelector('.carrier-container');
    const battleship = document.querySelector('.battleship-container');
    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');
    
    const width = 10;
    const userSquares = [];
    const computerSquares = [];
    let isHorizontal = true;
    let isGameOver = false;
    let currentPlayer = 'user';

    const createBoard = (grid,squares) =>{
        for(let i=0;i<width*width;i++){
            const square = document.createElement('div');
            square.dataset.id = i;
            square.classList.add('square');
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard(userGrid,userSquares);
    createBoard(computerGrid,computerSquares);

    //Ships

    const shipArray  = [
        {
            name : 'destroyer',
            directions : [
                [0,1], //horizontal
                [0,width] //vertical
            ]
        },
        {
            name : 'submarine',
            directions : [
                [0,1,2],
                [0,width,width*2]
            ]
        },
        {
            name : 'cruiser',
            directions : [
                [0,1,2],
                [0,width,width*2]
            ]
        },
        {
            name : 'battleship',
            directions : [
                [0,1,2,3],
                [0,width,width*2,width*3]
            ]
        },
        {
            name : 'carrier',
            directions : [
                [0,1,2,3,4],   
                [0,width,width*2,width*3,width*4]
            ]
        }
    ]

    //Draw the computers ships in random location
    const generate = (ship) =>{
        let randomDirection = Math.floor(Math.random()*ship.directions.length); //0 or 1 decide vertical or horizontal
        let current = ship.directions[randomDirection];
        let direction;
        if(randomDirection === 0) direction = 1;
        if(randomDirection === 1) direction = 10;

        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction))); //this will decide the starting position of ships and also checks whether the start position is not at the end;

        let isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
        let isAtRightEdge = current.some(index => (randomStart + index) % width === width-1);
        let isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);

        if(!isTaken && !isAtLeftEdge && !isAtRightEdge) current.forEach(index => computerSquares[randomStart+index].classList.add('taken', ship.name))

        else generate(ship);
    }

    generate(shipArray[0]);
    generate(shipArray[1]);
    generate(shipArray[2]);
    generate(shipArray[3]);
    generate(shipArray[4]);

    const rotate = () => {
        if(isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical')
            submarine.classList.toggle('submarine-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            carrier.classList.toggle('carrier-container-vertical')
            battleship.classList.toggle('battleship-container-vertical')
            isHorizontal = false;
            console.log(isHorizontal)
            return;
        }

        if(!isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical')
            submarine.classList.toggle('submarine-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            carrier.classList.toggle('carrier-container-vertical')
            battleship.classList.toggle('battleship-container-vertical')
            isHorizontal = true;
            console.log(isHorizontal)
            return;
        }
    }
    
    rotateButton.addEventListener('click',rotate)

    //move around user ship
    
    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    ships.forEach(ship => ship.addEventListener('mousedown', (e)=>{
        selectedShipNameWithIndex = e.target.id
    }))

    const dragStart = (e) =>{
        // console.log(e.target)
        draggedShip = e.target;
        draggedShipLength = draggedShip.childNodes.length;
        // console.log(draggedShip);
        // console.log(draggedShipLength);
    }

    const dragOver = (e) =>{
        e.preventDefault();
    }
    
    const dragEnter = (e) =>{
        e.preventDefault();
    }
    
    const dragLeave = (e) =>{
        console.log('drag leave')
    }
    
    const dragDrop = (e) =>{
        let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0,-2);
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
        
        let shipLastId = lastShipIndex + parseInt(e.target.dataset.id);//this will have the index of the square in the grid
        
        let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
        
        shipLastId = shipLastId - selectedShipIndex;
        const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,
                                      1,11,21,31,41,51,61,71,81,91,
                                      2,12,22,32,42,52,62,72,82,92,
                                      3,13,23,33,43,53,63,73,83,93];

        let newNotAllowedHorizontal = (notAllowedHorizontal.splice(0,lastShipIndex*width))
         
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,
                                    89,88,87,86,85,84,83,82,81,80,
                                    79,78,77,76,75,74,73,72,71,70,
                                    69,68,67,66,65,64,63,62,61,60]

        let newNotAllowedVertical = (notAllowedVertical.splice(0,lastShipIndex*width))
        

        if(isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)){
            for(let i=0; i<draggedShipLength;i++){
                userSquares[parseInt(e.target.dataset.id) -selectedShipIndex + i].classList.add('taken', shipClass);
            }
        } else if(!isHorizontal && !newNotAllowedVertical.includes(shipLastId)){
            for(let i=0; i<draggedShipLength;i++){
                userSquares[parseInt(e.target.dataset.id) -selectedShipIndex + width*i].classList.add('taken', shipClass);
            }   
        }else return;

        displayGrid.removeChild(draggedShip);
        
    }
    
    const dragEnd = (e) =>{
        console.log('dragEnd')
    }
    
    //game logic
    
    ships.forEach(ship => ship.addEventListener('dragstart',dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart',dragStart))
    userSquares.forEach(square => square.addEventListener('dragover',dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter',dragEnter))
    userSquares.forEach(square => square.addEventListener('dragLeave',dragLeave))
    userSquares.forEach(square => square.addEventListener('drop',dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend',dragEnd))

    const playGame = ()  => {
        if(isGameOver) return;
        if(currentPlayer === 'user') {
            turnDisplay.innerHTML = 'Your Go';
            //player's turn
            computerSquares.forEach(square => square.addEventListener('click', (e) => {
                revealSquare(square);
            }))
        }
        if(currentPlayer === 'computer') {
            turnDisplay.innerHTML = "Computer's Go";
            //computer's turn
            setTimeout (computerGo, 1000)

        }
    }
    
    startButton.addEventListener('click', playGame);

    let destroyerCount = 0;
    let cruiserCount = 0;
    let carrierCount = 0;
    let battleshipCount = 0;
    let submarineCount = 0;

    const revealSquare = (square) => {
        if(!square.classList.contains('boom')){
            if(square.classList.contains('destroyer')) destroyerCount++;
            if(square.classList.contains('submarine')) submarineCount++;
            if(square.classList.contains('cruiser')) cruiserCount++;
            if(square.classList.contains('carrier')) carrierCount++;
            if(square.classList.contains('battleship')) battleshipCount++;
            checkForWins();
        }
        if(square.classList.contains('taken')){
            square.classList.add('boom');
        }else square.classList.add('miss');
        
        currentPlayer = 'computer';
        playGame();
    }

    let aidestroyerCount = 0;
    let aicruiserCount = 0;
    let aicarrierCount = 0;
    let aibattleshipCount = 0;
    let aisubmarineCount = 0;

    const computerGo = () => {
        let random = Math.floor(Math.random() * userSquares.length)
        if(!userSquares[random].classList.contains('boom')){
            // userSquares[random].classList.add('boom');
            if(userSquares[random].classList.contains('destroyer')) aidestroyerCount++;
            if(userSquares[random].classList.contains('submarine')) aisubmarineCount++;
            if(userSquares[random].classList.contains('cruiser')) aicruiserCount++;
            if(userSquares[random].classList.contains('carrier')) aicarrierCount++;
            if(userSquares[random].classList.contains('battleship')) aibattleshipCount++;
            checkForWins();
        }
        if(userSquares[random].classList.contains('taken')){
            userSquares[random].classList.add('boom');
        }else {
            userSquares[random].classList.add('miss');
            // computerGo();
        }
        // else{
            // userSquares[random].classList.add('miss');  
            // computerGo()
        // } 
        // computerGo();

        currentPlayer = 'user';
        turnDisplay.innerHTML = 'Your Go'
    }   

    const checkForWins = () =>{
        if(destroyerCount === 2){
            infoDisplay.innerHTML ='You sunk the computers destroyer'
            destroyerCount = 10;
        }

        if(submarineCount === 3){
            infoDisplay.innerHTML ='You sunk the computers submarine'
            submarineCount = 10;
        }

        if(cruiserCount === 3){
            infoDisplay.innerHTML ='You sunk the computers cruiser'
            cruiserCount = 10;
        }

        if(battleshipCount === 4){
            infoDisplay.innerHTML ='You sunk the computers battleship'
            battleshipCount = 10;
        }

        if(carrierCount === 5){
            infoDisplay.innerHTML ='You sunk the computers carrier'
            carrierCount = 10;
        }

        //Computer win logic
        if(aidestroyerCount === 2){
            infoDisplay.innerHTML ="Computer sunk the User's destroyer"
            aidestroyerCount = 10;
        }

        if(aisubmarineCount === 3){
            infoDisplay.innerHTML ="Computer sunk the User's submarine"
            aisubmarineCount = 10;
        }

        if(aicruiserCount === 3){
            infoDisplay.innerHTML ="Computer sunk the User's cruiser"
            aicruiserCount = 10;
        }

        if(aibattleshipCount === 4){
            infoDisplay.innerHTML ="Computer sunk the User's battleship"
            aibattleshipCount = 10;
        }

        if(aicarrierCount === 5){
            infoDisplay.innerHTML ="Computer sunk the User's carrier"
            aicarrierCount = 10;
        }

        if((destroyerCount + cruiserCount + carrierCount + submarineCount +battleshipCount) === 50){
            infoDisplay.innerHTML = "You Win";
            gameOver();
        }

        if((aidestroyerCount + aicruiserCount + aicarrierCount + aisubmarineCount + aibattleshipCount) === 50){
            infoDisplay.innerHTML = "Computer Wins";
            gameOver();
        }
    }

    const gameOver = () => {
        isGameOver = true;
        startButton.removeEventListener('click', playGame);
    }
    const restart = () => {
        location.reload();
    }
    document.querySelector('#restart').addEventListener('click', restart);

    
})