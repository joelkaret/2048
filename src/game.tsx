import React, { useState, useEffect } from "react";
// import { Button, StyleSheet, Text, View } from "react-native";

let score: number = 0;
let highestNum: number = 0;

function twoOrFour(): number {
	let value = Math.random(); // Random number between 0 and 1
	if (value < 0.1) return 4; // 10% chance of 4
	return 2; // 90% chance of 2
}

function generateNewCell(grid: number[]): number[] {
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

// Function that squishes to the left
function squashLeft(grid: number[]): number[] {
	let colGrid = convertToCols(grid);
	colGrid = remGapsLeft(colGrid);
	multiplyLeft(colGrid);
	colGrid = remGapsLeft(colGrid);
	let squishedGrid = convertToGrid(colGrid);
	return squishedGrid;
}

// Function to rotate the grid clockwise 90deg
function rotateGrid(grid: number[], n: number): number[] {
	let colGrid: number[][] = convertToCols(grid);
	let rotatedColGrid: number[][] = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	for (let row = 0; row <= 3; row++) {
		for (let col = 0; col <= 3; col++) {
			let coords: number[] = matrixPointRotation90([col, row]);
			rotatedColGrid[coords[1]][coords[0]] = colGrid[row][col];
		}
	}
	let rotatedGrid = convertToGrid(rotatedColGrid);
	if (n > 1) {
		rotatedGrid = rotateGrid(rotatedGrid, n - 1);
	}
	return rotatedGrid;
}

// Use matrix multiplication to generate a new coord
// 90 degrees clockwise
function matrixPointRotation90(coord: number[]): number[] {
	//  0 1   [x, y]
	// -1 0
	let newCoord = [];
	newCoord[0] = coord[1];
	newCoord[1] = coord[0] * -1 + 3;
	return newCoord;
}

function squashUp(grid: number[]): number[] {
	let squishedGrid = rotateGrid(grid, 3);
	squishedGrid = squashLeft(squishedGrid);
	squishedGrid = rotateGrid(squishedGrid, 1);
	return squishedGrid;
}

function squashRight(grid: number[]): number[] {
	let squishedGrid = rotateGrid(grid, 2);
	squishedGrid = squashLeft(squishedGrid);
	squishedGrid = rotateGrid(squishedGrid, 2);
	return squishedGrid;
}

function squashDown(grid: number[]): number[] {
	let squishedGrid = rotateGrid(grid, 1);
	squishedGrid = squashLeft(squishedGrid);
	squishedGrid = rotateGrid(squishedGrid, 3);
	return squishedGrid;
}

// Function that multiplies squares that are next to each other together
function multiplyLeft(colGrid: number[][]) {
	for (let col = 0; col <= 3; col++) {
		for (let row = 0; row <= 2; row++) {
			if (colGrid[row][col] == colGrid[row + 1][col]) {
				colGrid[row][col] *= 2;
                score += colGrid[row][col]
                if (colGrid[row][col] > highestNum) {
                    highestNum = colGrid[row][col]
                }
				colGrid[row + 1][col] = 0;
			}
		}
	}
}

// Function to convert the grid into a grid of columns
function convertToCols(grid: number[]): number[][] {
	let colGrid: number[][] = [];
	for (let i = 0; i <= 3; i++) {
		colGrid.push([grid[i], grid[i + 4], grid[i + 8], grid[i + 12]]);
	}
	return colGrid;
}

// Function to convert a grid of columns into a normal grid
function convertToGrid(colGrid: number[][]): number[] {
	let grid: number[] = [];
	for (let i = 0; i <= 3; i++) {
		grid.push(colGrid[0][i]);
		grid.push(colGrid[1][i]);
		grid.push(colGrid[2][i]);
		grid.push(colGrid[3][i]);
	}
	return grid;
}

//Function to remove all the gaps to the left of any numbers.
function remGapsLeft(colGrid: number[][]): number[][] {
	for (let i = 1; i <= 3; i++) {
		for (let col = 0; col <= 3; col++) {
			for (let row = 0; row <= 2; row++) {
				if (!colGrid[row][col]) {
					colGrid[row][col] = colGrid[row + 1][col];
					colGrid[row + 1][col] = 0;
				}
			}
		}
	}
	return colGrid;
}

function compareArrays(a: any[], b: any[]): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

function checkLose(grid: number[]): boolean {
	if (!(compareArrays(grid, squashUp(grid)))) return false;
	if (!(compareArrays(grid, squashRight(grid)))) return false;
	if (!(compareArrays(grid, squashDown(grid)))) return false;
	if (!(compareArrays(grid, squashLeft(grid)))) return false;
	return true;
}

function convertToDisplay(arr: number[]): string[] {
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

function Game(): JSX.Element {
	let [grid, setGrid] = useState<number[]>(Array(16).fill(0));
	let [playing, setPlaying] = useState<boolean>(false);
    let [gameState, setGameState] = useState<string>("alive");


	function newGame() {
		let newGrid: number[] = Array(16).fill(0);
		newGrid = generateNewCell(newGrid);
		newGrid = generateNewCell(newGrid);
		setGrid(newGrid); // set the state of grid to the updated newGrid array
		setPlaying(true);
        setGameState("alive")
        score = 0
        highestNum = 0
	}

	function play(event: any) {
        if (event.key == 'l') setGameState("lost");
		if (!playing) return;
		let keys: string[] = [
			"ArrowUp",
			"w",
			"ArrowRight",
			"d",
			"ArrowDown",
			"s",
			"ArrowLeft",
			"a",
		];
		if (!keys.includes(event.key)) return;
		let temp: number[];
		switch (event.key) {
			case "ArrowUp":
			case "w":
				temp = squashUp(grid);
				if (compareArrays(grid, temp)) break;
				grid = generateNewCell(temp);
				break;
			case "ArrowRight":
			case "d":
				temp = squashRight(grid);
				if (compareArrays(grid, temp)) break;
				grid = generateNewCell(temp);
				break;
			case "ArrowDown":
			case "s":
				temp = squashDown(grid);
				if (compareArrays(grid, temp)) break;
				grid = generateNewCell(temp);
				break;
			case "ArrowLeft":
			case "a":
				temp = squashLeft(grid);
				if (compareArrays(grid, temp)) break;
				grid = generateNewCell(temp);
				break;
		}
		if (checkLose(grid)) {
			setGameState("lost");
		}
		setGrid(grid);
	}

	let displayGrid: string[] = convertToDisplay(grid);
	return (
		<main tabIndex={0} onKeyDown={play}>
			<div className={gameState}>
                <h2 id="Score">Score: {score} </h2>
                <h2 id="Highest">Highest number: {highestNum}</h2>
                <button onClick={newGame}>Restart</button>
            </div>
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
						New
					</button>
				</div>
			</div>
		</main>
	);
}

export default Game;
