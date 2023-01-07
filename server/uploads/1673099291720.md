
# BlockBall

Game that will allow you to play in a versus mode, as well as against an
opponent which will be a computer with different difficulty levels.
BlockBall was created in C++ with Allegro 5 library.

## Game Rules

Each hit block captured by a player's ball gives him 100 points to his score
and increases the ball's speed multiplier, however, if the opponent hits the
wrong ball in his square, then 150 points are taken away. Each life is worth 1000
points, if the player loses one life then 1000 points go to the opponent's account,
but if the player manages to keep them then 1000 points go to his account during
the game summary.

## Control Keys

    1. Menu:
        -	Up Arrow – go up
        -	Down Arrow - go down
        -	Enter - Accept
    2.	First Player:
        -	Up Arrow – start ball
        -	Left Arrow – go left
        -	Right Arrow - go right

    3.	Second Player:
        -	W – start ball
        -	A – go left
        -	D – go right
    4.	Pause:
        -	Escape – enter pause
        -	Space – continue game
        -	Enter – quit game
    5.	Game:
        -	O – load game
        -	P – save game

## Documentation

The documentation was generated using Doxygen version 1.9.1.
It has been written in html format, a separate folder has been separated
in the project for the content of the documentation and a separate folder
for the source files of the Doxygen program.To run the documentation,
you can install the doxygen program and upload the project to it.
However, the simplest way is to go to *html* folder and open
*index.html* like this:  **Blockball > html > index.html**

## Installation

The simplest way to run game is to open BlockBall.exe file. You can install that game
on your computer. Installer is in *installer* folder **intaller > Setup Files > BlockBall.exe**

## Tech Stack

- C++
- Allegro 5+

## Authors

- [@kondi171](https://github.com/kondi171)
- [@kwypych4](https://github.com/kwypych4)