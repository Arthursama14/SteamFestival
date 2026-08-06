const cloudImages = [

    "assets/cloud_1.png",
    "assets/cloud_2.png",
    "assets/cloud_3.png",
    "assets/cloud_4.png",
    "assets/cloud_5.png",
    "assets/cloud_6.png"

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

    return Math.random() * (max - min) + min;

}

function createCloud(){

    const cloud =
    document.createElement("div");

    cloud.className = "cloud";

    cloudLayer.appendChild(cloud);

    const size = random(200, 600);

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

    clouds.push(data);

}

// ------------------------------------
// Create Clouds
// ------------------------------------

for(let i = 0; i < 20; i++){

    createCloud();

}

// ------------------------------------
// Animation
// ------------------------------------

let last =
performance.now();

let lightOffset = 0;

function animate(time){

    const delta =
    (time - last) / 1000;

    last = time;

    // Animate clouds

    clouds.forEach(cloud => {

        cloud.x +=
        cloud.speed * delta;

        if(cloud.x >
        window.innerWidth + 300){

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
        0)`;

    });

    // Animate sunlight

    lightOffset += delta * 8;

    lightLayer.style.backgroundPosition =
        `${lightOffset}px 0`;

    // Gentle shimmering

    lightLayer.style.opacity =
        0.16 +
        Math.sin(time / 2500) * 0.03;

    requestAnimationFrame(
        animate
    );

}

requestAnimationFrame(
    animate
);

// ------------------------------------
// Resize Handling
// ------------------------------------

window.addEventListener("resize", () => {

    clouds.forEach(cloud => {

        if(cloud.y >
        window.innerHeight * .55){

            cloud.y =
            random(
                50,
                window.innerHeight * .55
            );

        }

    });

});