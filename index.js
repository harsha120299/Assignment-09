console.log("index.js loaded");

$(document).ready(function () {
    let score = 0;
    let level = 1;
    let gameStarted = false;
    let carPositionX = 20;
    let carPositionY = 39;

    const myCar = $("#myCar");
    const enemyCars = $(".enemycar");
    let gameInterval;
    let scoreTimer;

    $(document).keydown(function (e) {
      if (gameStarted) {
        if (e.key === "ArrowLeft" && carPositionX > 20) {
          carPositionX -= 5;
        }
        if (e.key === "ArrowRight" && carPositionX < 80) {
          carPositionX += 5;
        }
        if (e.key === "ArrowUp" && carPositionY > 0) {
          carPositionY -= 5;
        }
        if (e.key === "ArrowDown" && carPositionY < 80) {
          carPositionY += 5;
        }

        myCar.css({
          left: carPositionX + "%",
          top: carPositionY + "%",
        });
      }
    });

    $("#start").click(function () {
      if (!gameStarted) {
        gameStarted = true;
        $("#start").hide();
        enemyCars.css("visibility", "visible");

        score = 0;
        level = 1;
        updateUI();
        resetEnemyCars();

        gameInterval = setInterval(moveEnemyCars, 50);

        scoreTimer = setInterval(() => {
          score++;
          updateLevel();
          updateUI();
        }, 1000);
      }
    });

    function moveEnemyCars() {
      enemyCars.each(function () {
        let car = $(this);
        let currentTop = parseInt(car.css("top"));
        let speed = getSpeedByLevel();
        let newTop = currentTop + speed;

        if (newTop > 1000) {
          let randomLeft = getRandomLeftPosition();
          let randomTop = getRandomTopPosition();
          car.css({
            top: randomTop + "px",
            left: randomLeft + "px",
          });

          score++;
          updateLevel();
          updateUI();
        } else {
          car.css("top", newTop + "px");
        }

        if (checkCollision(myCar, car)) {
          gameOver();
        }
      });
    }

    function getSpeedByLevel() {
      switch (level) {
        case 1:
          return 5;
        case 2:
          return 7;
        case 3:
          return 10;
        case 4:
          return 13;
        default:
          return 15;
      }
    }

    function updateLevel() {
      if (score >= 100) level = 4;
      else if (score >= 70) level = 3;
      else if (score >= 40) level = 2;
      else level = 1;
    }

    function updateUI() {
      $("#score").text("Score : " + score);
      $("#level").text("Level : " + level);
    }

    function checkCollision(car1, car2) {
      let car1Pos = car1[0].getBoundingClientRect();
      let car2Pos = car2[0].getBoundingClientRect();

      return !(
        car1Pos.right < car2Pos.left ||
        car1Pos.left > car2Pos.right ||
        car1Pos.bottom < car2Pos.top ||
        car1Pos.top > car2Pos.bottom
      );
    }

    function gameOver() {
      clearInterval(gameInterval);
      clearInterval(scoreTimer);
      alert("Game Over! Your score is: " + score);
      resetGame();
    }

    function resetGame() {
      myCar.css({ left: "-7%", top: "39%" });
      carPositionX = -7;
      carPositionY = 39;
      clearInterval(scoreTimer);
      gameStarted = false;
      $("#start").show();
    }

    function resetEnemyCars() {
      let usedPositions = [];
      enemyCars.each(function () {
        let randomLeft = getRandomLeftPosition(usedPositions);
        let randomTop = getRandomTopPosition();
        $(this).css({
          top: randomTop + "px",
          left: randomLeft + "px",
        });
        usedPositions.push(randomLeft);
      });
    }

    function getRandomLeftPosition() {
      let randomLeft;
      let minSpacing = 100;
      let attempts = 0;

      while (attempts < 100) {
        randomLeft = Math.floor(Math.random() * 3) * 100 - 60;

        if (randomLeft >= 30 && randomLeft <= 230) {
          return randomLeft;
        }

        attempts++;
      }

      return randomLeft;
    }

    function getRandomTopPosition() {
      return Math.floor(Math.random() * -2000);
    }
  });