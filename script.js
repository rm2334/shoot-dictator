document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const sandal = document.getElementById('sandal');
    const targets = document.querySelectorAll('.target');
    const scoreDisplay = document.getElementById('score');
    const shootSound = document.getElementById('shootSound');
    const hitSound = document.getElementById('hitSound');
    let score = 0;
    let gameInterval;
    let isSandalClicked = false;
    let gameStarted = false;

    // Show mouse cursor until the game starts
    document.body.style.cursor = 'auto';

    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        sandal.style.display = 'block';
        resetGame();
        gameInterval = setInterval(checkCollision, 100);
        gameStarted = true;
        // Hide mouse cursor when the game starts
        document.body.style.cursor = 'none';
    });

    // Move sandal with mouse or touch and center it
    function moveSandal(x, y) {
        const adjustedX = x - (sandal.offsetWidth / 2);
        const adjustedY = y - (sandal.offsetHeight / 2);
        sandal.style.left = adjustedX + 'px';
        sandal.style.top = adjustedY + 'px';
    }

    // Mouse move event
    document.addEventListener('mousemove', function(e) {
        moveSandal(e.clientX, e.clientY);
    });

    // Touch move event for mobile devices
    document.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent scrolling while playing
        const touch = e.touches[0];
        moveSandal(touch.clientX, touch.clientY);
    });

    // Shoot event (mouse down)
    document.addEventListener('mousedown', function() {
        if (gameStarted) {
            shootSound.play();
            isSandalClicked = true;
        }
    });

    // Shoot event (touch start)
    document.addEventListener('touchstart', function() {
        if (gameStarted) {
            shootSound.play();
            isSandalClicked = true;
        }
    });

    // Reset sandal click status after mouse up
    document.addEventListener('mouseup', function() {
        isSandalClicked = false;
    });

    // Reset sandal click status after touch end
    document.addEventListener('touchend', function() {
        isSandalClicked = false;
    });

    function checkCollision() {
        targets.forEach(target => {
            const targetRect = target.getBoundingClientRect();
            const sandalRect = sandal.getBoundingClientRect();

            if (isSandalClicked && isHit(sandalRect, targetRect)) {
                score++;
                hitSound.play();
                scoreDisplay.innerText = 'Score: ' + score;
                showBloodEffect(target);
                isSandalClicked = false;
                setTimeout(() => resetTarget(target), 300); // Delay reset to show blood effect
            } else if (targetRect.bottom >= window.innerHeight) {
                score--;
                scoreDisplay.innerText = 'Score: ' + score;
                resetTarget(target);
            }
        });
    }

    function isHit(sandalRect, targetRect) {
        return !(
            sandalRect.right < targetRect.left ||
            sandalRect.left > targetRect.right ||
            sandalRect.bottom < targetRect.top ||
            sandalRect.top > targetRect.bottom
        );
    }

    function showBloodEffect(target) {
        target.classList.add('blood');
    }

    function resetTarget(target) {
        target.classList.remove('blood');
        target.style.left = Math.random() * (gameArea.clientWidth - target.offsetWidth) + 'px';
        target.style.bottom = '0';
        target.style.animationDuration = (Math.random() * 3 + 2) + 's';
    }

    function resetGame() {
        score = 0;
        scoreDisplay.innerText = 'Score: ' + score;
        targets.forEach(target => resetTarget(target));
    }

    targets.forEach(target => resetTarget(target));
});