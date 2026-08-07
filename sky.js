const cloudImages = [

```
"assets/cloud_1.png",
"assets/cloud_2.png",
"assets/cloud_3.png",
"assets/cloud_4.png",
"assets/cloud_5.png",
"assets/cloud_6.png"
```

];

const balloonImages = [

```
"assets/balloon_1.png",
"assets/balloon_2.png",
"assets/balloon_3.png",
"assets/balloon_4.png",
"assets/balloon_5.png"
```

];

const sky =
document.querySelector(".sky");

const cloudLayer =
document.getElementById("cloudLayer");

// ------------------------------------
// Sunshine Layers
// ------------------------------------

const lightLayer =
document.createElement("div");

lightLayer.className = "light-rays";

const rayLayer =
document.createElement("div");

rayLayer.className = "light-rays layer2";

const sparkleLayer =
document.createElement("div");

sparkleLayer.className = "light-rays layer3";

sky.appendChild(lightLayer);
sky.appendChild(rayLayer);
sky.appendChild(sparkleLayer);

// ------------------------------------
// Clouds
// ------------------------------------

const clouds = [];

function random(min, max){

```
return Math.random() * (max - min) + min;
```

}

function createCloud(){

```
const cloud =
document.createElement("div");

cloud.className = "cloud";

cloudLayer.appendChild(cloud);


const size =
random(200, 600);


const data = {

    element: cloud,

    x: random(
        -500,
        window.innerWidth
    ),

    y: random(
        50,
        window.innerHeight * .55
    ),

    speed: random(
        10,
        35
    )

};


cloud.style.width =
    size + "px";


cloud.style.height =
    size * .45 + "px";


cloud.style.opacity =
    random(.35, .85);


cloud.style.backgroundImage =
    `url(${cloudImages[
        Math.floor(
            Math.random() * cloudImages.length
        )
]})`;

// ------------------------------------
// Create Clouds
// ------------------------------------

for(let i = 0; i < 20; i++){

```
createCloud();
```

}

// ====================================
// BALLOONS
// ====================================

const balloons = [];

// Maximum balloons visible at once

const MAX_BALLOONS = 5;

// Delay between balloon spawns

const BALLOON_DELAY = 1500;

// Balloon sequence

let balloonIndex = 0;

// Time when another balloon can spawn

let nextBalloonSpawn = 0;

// Hourly launch queue

let hourlyQueue = [];

// Keep track of the hour

let lastHour = new Date().getHours();

// ------------------------------------
// Create Balloon
// ------------------------------------

function createBalloon(xPosition = null){

```
// Don't exceed maximum

if(balloons.length >= MAX_BALLOONS){

    return false;

}


const balloon =
    document.createElement("img");


balloon.className =
    "festival-balloon";


// Get next balloon in sequence

const image =
    balloonImages[
        balloonIndex
    ];


balloon.src = image;


balloon.alt =
    "Festival balloon";


// Move to next balloon

balloonIndex++;

if(balloonIndex >= balloonImages.length){

    balloonIndex = 0;

}


// Estimate balloon width

const balloonWidth = 80;


// Random starting position

let x;


if(xPosition !== null){

    x = xPosition;

}
else{

    x = random(
        balloonWidth,
        window.innerWidth - balloonWidth
    );

}


// Balloon starting position

const y =
    window.innerHeight + 100;


// Randomize movement slightly

const data = {

    element: balloon,

    x: x,

    y: y,

    speed: random(
        35,
        65
    ),

    swayAmount: random(
        15,
        35
    ),

    swaySpeed: random(
        0.7,
        1.3
    ),

    swayOffset: random(
        0,
        Math.PI * 2
    ),

    startTime: performance.now()

};


balloon.style.position =
    "fixed";


balloon.style.width =
    "80px";


balloon.style.height =
    "auto";


balloon.style.pointerEvents =
    "none";


balloon.style.zIndex =
    "5";


balloon.style.left =
    "0px";


balloon.style.top =
    "0px";


sky.appendChild(balloon);


balloons.push(data);


return true;
```

}

// ------------------------------------
// Request Balloon Spawn
// ------------------------------------

function requestBalloon(){

```
const now =
    performance.now();


// Respect spawn delay

if(now < nextBalloonSpawn){

    return;

}


// Respect maximum

if(balloons.length >= MAX_BALLOONS){

    return;

}


createBalloon();


nextBalloonSpawn =
    now + BALLOON_DELAY;
```

}

// ------------------------------------
// Click Sky To Spawn Balloon
// ------------------------------------

sky.addEventListener(
"click",
function(event){

```
    // Only trigger when the actual
    // sky background is clicked.

    if(event.target !== sky){

        return;

    }


    requestBalloon();

}
```

);

// ====================================
// HOURLY BALLOON EVENT
// ====================================

function startHourlyBalloonEvent(){

```
hourlyQueue = [

    1,
    2,
    3,
    4,
    5

];
```

}

// ------------------------------------
// Check Hour
// ------------------------------------

function checkHourlyEvent(){

```
const now =
    new Date();


const currentHour =
    now.getHours();


if(currentHour !== lastHour){

    lastHour =
        currentHour;


    startHourlyBalloonEvent();

}
```

}

// ------------------------------------
// Spawn Hourly Balloons
// ------------------------------------

function processHourlyQueue(){

```
if(hourlyQueue.length === 0){

    return;

}


const now =
    performance.now();


if(now < nextBalloonSpawn){

    return;

}


if(balloons.length >= MAX_BALLOONS){

    return;

}


// Determine which balloon
// in the sequence is being launched.

const queuePosition =
    5 - hourlyQueue.length;


// Divide screen into equal sections.

const spacing =
    window.innerWidth / 6;


const x =
    spacing * (queuePosition + 1);


createBalloon(x);


// Remove item from queue

hourlyQueue.shift();


nextBalloonSpawn =
    now + BALLOON_DELAY;
```

}

// ====================================
// BALLOON ANIMATION
// ====================================

function animateBalloons(time){

```
balloons.forEach(
    (balloon, index) => {


        // Move upward

        balloon.y -=
            balloon.speed /
            60;


        // Gentle horizontal sway

        const sway =
            Math.sin(
                (time / 1000) *
                balloon.swaySpeed +
                balloon.swayOffset
            ) *
            balloon.swayAmount;


        const currentX =
            balloon.x + sway;


        balloon.element.style.transform =

            `translate3d(
                ${currentX}px,
                ${balloon.y}px,
                0
            )`;


    }
);


// Remove balloons that
// have completely left the screen

for(
    let i = balloons.length - 1;
    i >= 0;
    i--
){

    const balloon =
        balloons[i];


    if(
        balloon.y <
        -150
    ){

        balloon.element.remove();

        balloons.splice(
            i,
            1
        );

    }

}
```

}

// ====================================
// Main Animation
// ====================================

let last =
performance.now();

let rayOffset1 = 0;
let rayOffset2 = 0;
let rayOffset3 = 0;

function animate(time){

```
const delta =
    (time - last) / 1000;


last = time;


// --------------------------------
// Animate Clouds
// --------------------------------

clouds.forEach(cloud => {

    cloud.x +=
        cloud.speed * delta;


    if(
        cloud.x >
        window.innerWidth + 300
    ){

        cloud.x = -600;


        cloud.y =
            random(
                50,
                window.innerHeight * .55
            );

    }


    cloud.element.style.transform =

        `translate3d(
            ${cloud.x}px,
            ${cloud.y}px,
            0
        )`;

});


// --------------------------------
// Animate Balloons
// --------------------------------

animateBalloons(time);


// --------------------------------
// Hourly Event
// --------------------------------

checkHourlyEvent();

processHourlyQueue();


// --------------------------------
// Animate Sunlight
// --------------------------------

rayOffset1 +=
    delta * 3;


rayOffset2 +=
    delta * 7;


rayOffset3 +=
    delta * 12;


// Slow wide rays

lightLayer.style.backgroundPosition =
    `${rayOffset1}px 0`;


// Medium rays

rayLayer.style.backgroundPosition =
    `${-rayOffset2}px 0`;


// Thin bright rays

sparkleLayer.style.backgroundPosition =
    `${rayOffset3}px 0`;


// Gentle shimmering

const shimmer =
    0.17 +
    Math.sin(time / 2800) * 0.03;


lightLayer.style.opacity =
    shimmer;


rayLayer.style.opacity =
    shimmer * 0.8;


sparkleLayer.style.opacity =
    0.08 +
    Math.sin(time / 1500) * 0.03;


requestAnimationFrame(
    animate
);
```

}

requestAnimationFrame(
animate
);

// ------------------------------------
// Resize Handling
// ------------------------------------

window.addEventListener(
"resize",
() => {

```
    clouds.forEach(cloud => {

        if(
            cloud.y >
            window.innerHeight * .55
        ){

            cloud.y =
                random(
                    50,
                    window.innerHeight * .55
                );

        }

    });

}
```

);
