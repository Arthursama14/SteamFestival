// ==========================================
// FESTIVAL BALLOONS
// ==========================================

const balloonImages = [

    "assets/balloon_1.png",
    "assets/balloon_2.png",
    "assets/balloon_3.png",
    "assets/balloon_4.png",
    "assets/balloon_5.png"

];


const balloonSky =
document.querySelector(".sky");

const balloons = [];


const MAX_BALLOONS = 5;

const SPAWN_DELAY = 1500;


let balloonIndex = 0;

let nextSpawnTime = 0;


// Hourly event tracking

let lastHour =
new Date().getHours();


let hourlyQueue = [];



// ==========================================
// Utility
// ==========================================

function random(min, max){

    return Math.random() * (max - min) + min;

}



// ==========================================
// Create Balloon
// ==========================================

function createBalloon(customX = null){


    if(balloons.length >= MAX_BALLOONS){

        return;

    }


    const balloon =
    document.createElement("img");


    balloon.className =
    "festival-balloon";


    balloon.src =
    balloonImages[balloonIndex];


    balloonIndex++;


    if(balloonIndex >= balloonImages.length){

        balloonIndex = 0;

    }


    const x =
    customX !== null
        ? customX
        : random(
            40,
            window.innerWidth - 40
        );


    const balloonData = {

        element: balloon,

        x:x,

        y:window.innerHeight + 100,


        speed:random(
            40,
            70
        ),


        swayAmount:random(
            15,
            40
        ),


        swaySpeed:random(
            0.8,
            1.5
        ),


        swayOffset:random(
            0,
            Math.PI * 2
        )

    };


    balloon.style.position =
    "fixed";


    balloon.style.width =
    "80px";


    balloon.style.height =
    "auto";


    balloon.style.left =
    "0px";


    balloon.style.top =
    "0px";


    balloon.style.pointerEvents =
    "none";


    balloon.style.zIndex =
    "10";


    document.body.appendChild(
        balloon
    );


    balloons.push(
        balloonData
    );

}



// ==========================================
// Click Spawn
// ==========================================

balloonSky.addEventListener(
    "click",
    event => {


        // Only background clicks

        if(event.target !== sky){

            return;

        }


        const now =
        performance.now();


        if(now < nextSpawnTime){

            return;

        }


        createBalloon();


        nextSpawnTime =
        now + SPAWN_DELAY;


    }
);



// ==========================================
// Hourly Balloon Formation
// ==========================================

function checkHour(){


    const currentHour =
    new Date().getHours();


    if(currentHour !== lastHour){


        lastHour =
        currentHour;


        hourlyQueue = [

            0,
            1,
            2,
            3,
            4

        ];

    }

}



function processHourlyQueue(){


    if(hourlyQueue.length === 0){

        return;

    }


    const now =
    performance.now();


    if(now < nextSpawnTime){

        return;

    }


    if(balloons.length >= MAX_BALLOONS){

        return;

    }


    const position =
    5 - hourlyQueue.length;


    const spacing =
    window.innerWidth / 6;


    const x =
    spacing * (position + 1);



    createBalloon(x);


    hourlyQueue.shift();


    nextSpawnTime =
    now + SPAWN_DELAY;


}



// ==========================================
// Balloon Animation
// ==========================================

function animateBalloons(time){


    balloons.forEach(
        balloon => {


            balloon.y -=
            balloon.speed / 60;



            const sway =
            Math.sin(
                time / 1000 *
                balloon.swaySpeed +
                balloon.swayOffset
            )
            *
            balloon.swayAmount;



            balloon.element.style.transform =

            `
            translate3d(
                ${balloon.x + sway}px,
                ${balloon.y}px,
                0
            )
            `;


        }
    );



    // Remove balloons off screen

    for(
        let i = balloons.length - 1;
        i >= 0;
        i--
    ){


        if(
            balloons[i].y < -200
        ){

            balloons[i]
            .element
            .remove();


            balloons.splice(
                i,
                1
            );

        }

    }

}



// ==========================================
// Animation Loop
// ==========================================

function balloonAnimationLoop(time){


    animateBalloons(time);


    checkHour();


    processHourlyQueue();


    requestAnimationFrame(
        balloonAnimationLoop
    );

}


requestAnimationFrame(
    balloonAnimationLoop
);