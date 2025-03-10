let timer;
let phaseIndex = 0;
let focusCount = 0; // Counter for completed focus phases

// Initialize Pomomon data -----------------------------------------------------------------------------------
let experience = 0;
let maxExperience = 100;
let level = 1;  // Player level
let button;
let eggImage;
let monsterImage;
let isEgg = true;
let timerP = 0;
let isTimerDone = false;
let elapsedTime = 0;
let canCollect = false;  // If the xp can be collected

let health = 50;
let maxHealth = 50;
let dmgButton;
let damage = 10;
// End of pomomon initializing -------------------------------------------------------------------------------

// Initialize store and inventory ----------------------------------------------------------------------------

let playerCurrency = 150;

//Player's inventory
let inventory = [];

// Shop items available for purchase.
let shopItems = [
    { name: "Apple", price: 20 },
    { name: "Steak", price: 50 },
    { name: "Carrot", price: 12 }
  ];

// Details for each food item (used when adding to inventory).
const itemDetails = {
    "Apple":  { nutrition: 10, description: "A juicy apple." },
    "Steak":  { nutrition: 30, description: "A hearty steak." },
    "Carrot": { nutrition: 5,  description: "A crunchy carrot." }
  };

// Panel layout
let inventoryX, inventoryY;
const inventoryWidth = 250;
let shopX, shopY;
const shopWidth = 250;
const ITEM_HEIGHT = 30, ITEM_PADDING = 10;

// End of store and inventory initializing --------------------------------------------------------------------

// Define the phases of the Pomodoro cycle
let phases = [
    { name: "Pomomon", duration: 25 * 60, color: '#d95550', interactive: false },
    { name: "Short Break", duration: 5 * 60, color: '#4c9195', interactive: true },
    { name: "Long Break", duration: 15 * 60, color: '#457ca3', interactive: true }
];

let timeLeft = phases[phaseIndex].duration;
let isRunning = false;  // Tracks whether the timer is running
let hasStarted = false; // Tracks if the timer has been started at least once

function preload() {
    eggImage = loadImage('egg.png');  // Just use this to load the egg image
    monsterImage = loadImage('monster.png');  // Load the monster image (Any placeholder will do)
  }
  

function setup() {
    createCanvas(windowWidth, windowHeight);
    //createCanvas(1440, 1080);
    textAlign(CENTER, CENTER);
    textSize(24);
    timer = setInterval(tick, 1000); // Start a timer that calls tick() every second

    // set Panel layout for Shop and Inventory -------------------------------------
    inventoryX = 2 * width / 4 + inventoryWidth/4;
    inventoryY = height / 4 + 40;
    shopX = 2 * width / 4 + inventoryWidth + shopWidth;
    shopY = height/4 + 40;
    // ------------------------------------------------------------------------------

    button = createButton('Collect Experience');
    button.position(width/3, height/2);
    button.mousePressed(increaseExperience);
    button.attribute('disabled', '');

    dmgButton = createButton('Take Damage');
    dmgButton.position(width/3, height/2 + 250);
    dmgButton.mousePressed(takeDamage);
    
    resetTimerP();
}

function draw() {
    background(255); // White background
    textAlign(CENTER, CENTER);
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

    // Store and Inventory -----------------------------------------------------------------

    //Display Player Currency
    textSize(18);
    fill(0);
    textAlign(CENTER, TOP);
    text("Currency: " + playerCurrency, 11 * width / 17, height /4);

    // Draw Inventory Panel
    // Background
    fill(240);
    stroke(0);
    let invPanelHeight = (inventory.length + 1) * (ITEM_HEIGHT + ITEM_PADDING) + ITEM_PADDING;
    rect(inventoryX, inventoryY, inventoryWidth, invPanelHeight);
    noStroke();

    // Header for inventory
    fill(0);
    textAlign(LEFT, CENTER);
    text("Inventory:", inventoryX + ITEM_PADDING, inventoryY + ITEM_PADDING + ITEM_HEIGHT / 2);

    // List each inventory item
    for (let i = 0; i < inventory.length; i++) {
        let item = inventory[i];
        let y = inventoryY + ITEM_PADDING + (i + 1) * (ITEM_HEIGHT + ITEM_PADDING);
        let label = item.name + " (" + item.quantity + ")";
        text(label, inventoryX + ITEM_PADDING, y + ITEM_HEIGHT / 2);
        // Click detection
        item.box = {
        x: inventoryX + ITEM_PADDING,
        y: y,
        w: textWidth(label),
        h: ITEM_HEIGHT
        };
    }

    // Draw Shop Panel
    fill(240);
    stroke(0);
    let shopPanelHeight = (shopItems.length + 1) * (ITEM_HEIGHT + ITEM_PADDING) + ITEM_PADDING;
    rect(shopX, shopY, shopWidth, shopPanelHeight);
    noStroke();

    // Header for shop
    fill(0);
    textAlign(LEFT, CENTER);
    text("Shop:", shopX + ITEM_PADDING, shopY + ITEM_PADDING + ITEM_HEIGHT / 2);

    // Shop item with its price
    for (let i = 0; i < shopItems.length; i++) {
        let item = shopItems[i];
        let y = shopY + ITEM_PADDING + (i + 1) * (ITEM_HEIGHT + ITEM_PADDING);
        let label = item.name + " - " + item.price + " currency";
        text(label, shopX + ITEM_PADDING, y + ITEM_HEIGHT / 2);
        item.box = {
        x: shopX + ITEM_PADDING,
        y: y,
        w: textWidth(label),
        h: ITEM_HEIGHT
        };
    }

    // Pomomon Code: -------------------------------------------------------------------------------
    if (isEgg) {
        image(eggImage, width/3, height/3, 100, 100);
      } else {
        image(monsterImage, width/3, height/3, 100, 100);
      }
      
      fill(0, 255, 0);
      noStroke();
      rect(8 * width/28, 3 * height/7, map(experience, 0, maxExperience, 0, 300), 30); // experience bar

      fill(255, 0, 0);
      noStroke();
      rect(8 * width/28, 3 * height/7 + 250, map(health, 0, maxHealth, 0, 300), 30); // health bar
      
      fill(0);
      textSize(20);
      textAlign(CENTER, CENTER);
      text('Level: ' + level, 4 * width / 11, 2 * height/7);
      text('Experience: ' + experience + '/' + maxExperience, 4 * width / 11, 6 * height/13);
      text('Health: ' + health + '/' + maxHealth, 4 * width/11, 6 * height/13 + 250);
      
      if (!isTimerDone) {
        elapsedTime = floor((millis() - timerP) / 1000);
        textSize(18);
        text('Time until monster: ' + (5 - elapsedTime) + 's', 4 * width / 11, 7 * height /13);
        
        // Once time has elapsed the button can be pressed and the monster will be shown
        if (elapsedTime >= 5) {
          isEgg = false;
          isTimerDone = true;
          button.removeAttribute('disabled');
          canCollect = true;
        }
      }
    
      if (experience >= maxExperience) {
        experience = 0;
        level++;
        textSize(24);
        text('Level Up! Now at Level ' + level, 4 * width / 11, 8 * height/13);
      }
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
        playerCurrency += 200;
    } else if (phaseIndex === 2) {
        focusCount = 0; // Reset Pomodoro count after the long break ends
        phaseIndex = 0; // Return to Pomomon (focus phase)
    } else if (phaseIndex === 0) {
        phaseIndex = 1; // Move to Short Break
        playerCurrency += 100;
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

    // Inventory and Store ----------------------------------------------------------
    // Check for Inventory Item Clicks (to feed) 
    if (mouseX >= inventoryX && mouseX <= inventoryX + inventoryWidth) {
        // Loop through inventory items
        for (let i = 0; i < inventory.length; i++) {
        let box = inventory[i].box;
        if (
            mouseX >= box.x && mouseX <= box.x + box.w &&
            mouseY >= box.y && mouseY <= box.y + box.h
        ) {
            // Feed using the clicked item.
            feedPet(inventory[i], i);
            return;
        }
        }
    }
    
    // Check for Shop Item Clicks (to purchase) -----
    if (mouseX >= shopX && mouseX <= shopX + shopWidth) {
        for (let i = 0; i < shopItems.length; i++) {
        let box = shopItems[i].box;
        if (
            mouseX >= box.x && mouseX <= box.x + box.w &&
            mouseY >= box.y && mouseY <= box.y + box.h
        ) {
            // Attempt to purchase the clicked shop item.
            attemptPurchase(shopItems[i]);
            return;
        }
        }
    }
}


// Feeding Functionality
// Called when an inventory item is clicked.
function feedPet(item, index) {
    console.log("Feeding pet with " + item.name + " which restores " + item.nutrition + " hunger points.");
    
    // Restore health
    health += item.nutrition;
    if (health > maxHealth)
      health = maxHealth;

    // Reduce the item’s quantity
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      inventory.splice(index, 1);
    }
  }
  
  // Shop Purchase Functionality
  function attemptPurchase(shopItem) {
    if (playerCurrency >= shopItem.price) {
      playerCurrency -= shopItem.price;
      addToInventory(shopItem.name);
      console.log("Purchased " + shopItem.name);
    } else {
      console.log("Not enough currency to buy " + shopItem.name);
    }
  }
  
  // Add the purchased item to the player's inventory.
  function addToInventory(itemName) {
    // Check if the item is already in inventory.
    for (let i = 0; i < inventory.length; i++) {
      if (inventory[i].name === itemName) {
        inventory[i].quantity++;
        return;
      }
    }
    // If not found, add it using the details from itemDetails.
    let details = itemDetails[itemName];
    if (details) {
      inventory.push({ 
        name: itemName, 
        quantity: 1, 
        nutrition: details.nutrition, 
        description: details.description 
      });
    }
  }

  function increaseExperience() {
    if (canCollect && experience < maxExperience) {
      experience += 10;
      canCollect = false;
      button.attribute('disabled', '');
  
      resetTimerP();
      isEgg = true;
      isTimerDone = false;
    }
  }
  
  function resetTimerP() {
    timerP = millis();
  }

  function takeDamage() {
    health -= damage;

    if (health < 0)
      health = 0;
  }