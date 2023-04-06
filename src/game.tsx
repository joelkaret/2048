import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

function convertToDisplay(arr: number[]) {
    let convertedArr: string[] = [];
    for (let i = 0; i <= 15; i++) {
        if (arr[i] == 0) {
            convertedArr.push("");
        } else {
            convertedArr.push(`${arr[i]}`);
        }
    }
    return convertedArr;
}

function twoOrFour() {
    let value = Math.random(); // Random number between 0 and 1
    if (value < 0.1) return 4; // 10% chance of 4
    return 2; // 90% chance of 2
}

// let grid: number[] = Array(16).fill(0);
console.log("ohwi");

function Game(): JSX.Element {
    let [grid, setGrid] = useState(Array(16).fill(0));
    let [playing, setPlaying] = useState(false);

    function generateNewCell(grid: number[]) {
        let gridIndexes: number[] = [];
        for (let i = 0; i <= 15; i++) {
            if (grid[i] == 0) {
                gridIndexes.push(i);
            }
        }
        let randomIndex: number =
            gridIndexes[Math.floor(Math.random() * gridIndexes.length)];
        let newGrid: number[] = [...grid]; // Copy by value
        newGrid[randomIndex] = twoOrFour();
        return newGrid;
    }

    function newGame() {
        let newGrid: number[] = Array(16).fill(0);
        newGrid = generateNewCell(newGrid);
        newGrid = generateNewCell(newGrid);
        setGrid(newGrid); // set the state of grid to the updated newGrid array
        setPlaying(true);
    }

    function play(event: any) {
        if (!playing) return;
        let newGrid: number[] = grid;
        let keys: string[] = [
            "ArrowUp",
            "w",
            "ArrowLeft",
            "a",
            "ArrowDown",
            "s",
            "ArrowRight",
            "d",
        ];
        if (!keys.includes(event.key)) return;
        console.log(event.key);
    }

    let displayGrid: string[] = convertToDisplay(grid);
    return (
        <div className='main' tabIndex={0} onKeyDown={play}>
            <div className="gameDisplay">
                <div className="board">
                    <div className="cell" id="1">
                        {displayGrid[0]}
                    </div>
                    <div className="cell" id="2">
                        {displayGrid[1]}
                    </div>
                    <div className="cell" id="3">
                        {displayGrid[2]}
                    </div>
                    <div className="cell" id="4">
                        {displayGrid[3]}
                    </div>
                    <div className="cell" id="5">
                        {displayGrid[4]}
                    </div>
                    <div className="cell" id="6">
                        {displayGrid[5]}
                    </div>
                    <div className="cell" id="7">
                        {displayGrid[6]}
                    </div>
                    <div className="cell" id="8">
                        {displayGrid[7]}
                    </div>
                    <div className="cell" id="9">
                        {displayGrid[8]}
                    </div>
                    <div className="cell" id="10">
                        {displayGrid[9]}
                    </div>
                    <div className="cell" id="11">
                        {displayGrid[10]}
                    </div>
                    <div className="cell" id="12">
                        {displayGrid[11]}
                    </div>
                    <div className="cell" id="13">
                        {displayGrid[12]}
                    </div>
                    <div className="cell" id="14">
                        {displayGrid[13]}
                    </div>
                    <div className="cell" id="15">
                        {displayGrid[14]}
                    </div>
                    <div className="cell" id="16">
                        {displayGrid[15]}
                    </div>
                </div>
                <div className="options">
                    <button className="buttons" onClick={newGame}>
                        {"New"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Game;
