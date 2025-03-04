let timer;
let phaseIndex = 0;
let focusCount = 0; // Counter for completed focus phases

// Define the phases of the Pomodoro cycle
let phases = [
    { name: "Pomomon", duration: 25 * 60, color: '#d95550', interactive: false },
    { name: "Short Break", duration: 5 * 60, color: '#4c9195', interactive: true },
    { name: "Long Break", duration: 15 * 60, color: '#457ca3', interactive: true }
];

let timeLeft = phases[phaseIndex].duration;
let isRunning = false;  // Tracks whether the timer is running
let hasStarted = false; // Tracks if the timer has been started at least once

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(24);
    timer = setInterval(tick, 1000); // Start a timer that calls tick() every second
}

function draw() {
    background(255); // White background
    drawPhaseIndicators();

    let currentColor = phases[phaseIndex].color;

    // Draw the timer box
    fill(currentColor);
    noStroke();
    rect(width / 2 - 250, 100, 500, 180, 20);
    fill(255);
    textSize(80);
    text(formatTime(timeLeft), width / 2, 160);

    const buttonY = 210;
    
    // Draw the Start/Pause button
    drawButton(isRunning ? "Pause" : "Start", width / 2 - 75, buttonY, '#ffffff', 150, 50);
    
    // Draw the Skip button if the timer has started and is running
    if (hasStarted && isRunning) {
        drawButton("\u23ED", width / 2 + 100, buttonY, '#ffffff', 50, 50);
    }

    // Display the Pomodoro count below the button
    fill(0);
    textSize(20);
    text(`Pomodoro Count: ${focusCount}`, width / 2, buttonY + 80);

    drawPomomonSection();
    drawInventorySection();
}

// Draws the phase indicators at the top of the screen
function drawPhaseIndicators() {
    let padding = 30;
    let totalWidth = 500;
    let startX = (width - totalWidth) / 2;
    let indicatorWidth = 140;

    for (let i = 0; i < phases.length; i++) {
        fill(i === phaseIndex ? phases[i].color : 200);
        let cornerRadius = 5;
        rect(startX + i * (indicatorWidth + padding), 20, indicatorWidth, 40, cornerRadius);
        fill(255);
        textSize(20);
        text(phases[i].name, startX + i * (indicatorWidth + padding) + indicatorWidth / 2, 40);
    }
}

// Function to draw a button with a label
function drawButton(label, x, y, btnColor, w, h) {
    fill(btnColor);
    stroke(0);
    strokeWeight(3);
    rect(x, y, w, h, 20);
    fill(0);
    noStroke();
    textSize(20);
    text(label, x + w / 2, y + h / 2);
}

// Draw the Pomomon section box
function drawPomomonSection() {
    let boxWidth = 600;
    let boxHeight = 700;
    let x = width / 2 - boxWidth / 2 - 400;
    let y = height / 2 - boxHeight / 2;

    fill(220);
    rect(x, y, boxWidth, boxHeight, 20);
    fill(0);
    textSize(30);
    text("My Pomomon", x + boxWidth / 2, y - 30);
}

// Draw the Inventory section box
function drawInventorySection() {
    let boxWidth = 800;
    let boxHeight = 700;
    let x = width / 2 - boxWidth / 2 + 400;
    let y = height / 2 - boxHeight / 2;

    fill(220);
    rect(x, y, boxWidth, boxHeight, 20);
    fill(0);
    textSize(30);
    text("Inventory", x + boxWidth / 2, y - 30);
}

// Timer countdown function
function tick() {
    if (isRunning && timeLeft > 0) {
        timeLeft--; // Decrease time left by one second
    } else if (timeLeft === 0) {
        nextPhase(); // Move to the next phase when time reaches 0
    }
}

// Convert time into MM:SS format
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Move to the next phase in the Pomodoro cycle
function nextPhase() {
    if (phaseIndex === 0) {
        focusCount++; // Increase count after completing a focus phase
    }

    if (focusCount >= 4 && phaseIndex === 0) {
        phaseIndex = 2; // Move to Long Break
    } else if (phaseIndex === 2) {
        focusCount = 0; // Reset Pomodoro count after the long break ends
        phaseIndex = 0; // Return to Pomomon (focus phase)
    } else if (phaseIndex === 0) {
        phaseIndex = 1; // Move to Short Break
    } else {
        phaseIndex = 0; // Return to Pomomon (focus phase)
    }

    timeLeft = phases[phaseIndex].duration; // Reset the timer for the new phase
    hasStarted = false;
    isRunning = false;
}

// Handle mouse clicks for buttons and phase selection
function mousePressed() {
    let indicatorWidth = 140;
    let padding = 30;
    let totalWidth = 500;
    let startX = (width - totalWidth) / 2;

    // Check if a phase indicator was clicked
    for (let i = 0; i < phases.length; i++) {
        if (mouseX > startX + i * (indicatorWidth + padding) && 
            mouseX < startX + i * (indicatorWidth + padding) + indicatorWidth && 
            mouseY > 20 && mouseY < 60) {
            phaseIndex = i;
            timeLeft = phases[phaseIndex].duration;
            isRunning = false;
            hasStarted = false;
        }
    }

    const buttonY = 210;
    
    // Check if the Start/Pause button was clicked
    if (mouseY > buttonY && mouseY < buttonY + 50) {
        if (mouseX > width / 2 - 75 && mouseX < width / 2 + 75) {
            isRunning = !isRunning;
            hasStarted = true;
        }
        
        // Check if the Skip button was clicked
        if (isRunning && mouseX > width / 2 + 100 && mouseX < width / 2 + 150) {
            nextPhase();
        }
    }
}
