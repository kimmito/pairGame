(() => {
    const gameContainer = document.querySelector('.game');
    const modalOverlay = document.querySelector('.modal-overlay');
    const restartButton = document.querySelector('.restart');
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let timer;
    let timerElapsed = 0;
    let rank = '';
    let timerStatus = false;

    let cards = [
        {
            name: "card1",
            img: "<img src='./img/ (1).jpeg'>",
        },
        {
            name: "card2",
            img: "<img src='./img/ (2).jpeg'>",
        },
        {
            name: "card3",
            img: "<img src='./img/ (3).jpeg'>",
        },
        {
            name: "card4",
            img: "<img src='./img/ (4).jpeg'>",
        },
        {
            name: "card5",
            img: "<img src='./img/ (5).jpeg'>",
        },
        {
            name: "card6",
            img: "<img src='./img/ (6).jpeg'>",
        },
        {
            name: "card7",
            img: "<img src='./img/ (7).jpeg'>",
        },
        {
            name: "card8",
            img: "<img src='./img/ (8).jpeg'>",
        },
    ];

    const generateRandomId = () => {
        return Math.random().toString(36).substr(2, 9);
    };
    
    const duplicateCards = () => {
        const cardsArr = [];
        cards.forEach(card => {
            const cardWithId1 = {...card, id: generateRandomId()};
            const cardWithId2 = {...card, id: cardWithId1.id};
            cardsArr.push(cardWithId1, cardWithId2);
        });
        return cardsArr;
    };
    
    
    let cardsArr = duplicateCards();

    const shuffleCards = () => {
        cardsArr.sort(() => Math.random() - 0.5);
    };

    const createBoard = () => {
        gameContainer.innerHTML = '';
        shuffleCards();
        cardsArr.forEach((cardObject, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = cardObject.id;
            cardElement.addEventListener('click', flipCard);
            gameContainer.appendChild(cardElement);
        });
    };

    const flipCard = (event) =>{
        if (lockBoard) return;
        const clickedCard = event.target;
        
        if (clickedCard === firstCard) return;

        const cardId = clickedCard.dataset.value;
        const cardObject = cardsArr.find(card => card.id === cardId);
        clickedCard.innerHTML = cardObject.img;
        clickedCard.classList.add('flipped');

        if (!timerStatus){
            startTimer();
            timerStatus = true;
        }

        if (!firstCard){
            firstCard = clickedCard;
            return;
        }
        secondCard = clickedCard;
        lockBoard = true;

        checkForMatch();
        checkForWin();
    };

    const checkForMatch = () => {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        isMatch ? disableCards() : unflipCards();
    };

    const disableCards = () => {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    };

    const unflipCards = () => {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerHTML = '';
            secondCard.innerHTML = '';
            resetBoard();
        }, 1000);
    };

    const resetBoard = () => {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    const checkForWin = () => {
        const allCards = document.querySelectorAll('.card');
        const matchedCards = Array.from(allCards).filter(card => card.classList.contains('flipped'));
        if (matchedCards.length === 16) {
            stopTimer();
            modalOverlay.classList.add('actived');
        }
    };
    
    const restartGame = () => {
        modalOverlay.classList.remove('actived');
        document.querySelector('.rank-display').classList.remove('actived');
        timeElapsed = 0;
        updateTimerDisplay();
        createBoard();
        timerStatus = false;
    };
    
    const startTimer = () => {
        timeElapsed = 0;
        timer = setInterval(() => {
            timeElapsed++;
            updateTimerDisplay();
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timer);
        determineRank();
        timerStatus = false;
    }
    
    const updateTimerDisplay = () => {
        const timerDisplay = document.querySelector('.timer-display');
        timerDisplay.textContent = `Время: ${timeElapsed} сек`;
    };

    const determineRank = () => {
        if (timeElapsed <= 10){
            rank = 'Молодец, отличный результат!';
        }
        else if (timeElapsed <= 20){
            rank = 'Отлично!';
        }
        else if (timeElapsed <= 30){
            rank = 'Неплохо!';
        }
        else if (timeElapsed <= 40){
            rank = 'Попробуй еще!';
        }
        else{
            rank = 'Видимо не повезло, давай еще!';
        }
        showRank();
    }
    
    const showRank = () => {
        const rankDisplay = document.querySelector('.rank-display');
        rankDisplay.classList.add('actived');
        rankDisplay.textContent = `${rank} (Время: ${timeElapsed} секунд)`;
    }

    createBoard();
    restartButton.addEventListener('click', restartGame);
})()

