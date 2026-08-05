/* ==========================================================
   STEAM FESTIVAL PASSPORT
   BINGO v2.0
========================================================== */

const COOKIE_NAME = "stemFestivalBingo";

const ICON_FOLDER = "assets/icons/";

const board = document.getElementById("bingo");

let bingoData = [];

let completed = {};

/* ==========================================================
   COOKIE FUNCTIONS
========================================================== */

function setCookie(name, value, days = 365) {

    const expires = new Date();

    expires.setTime(
        expires.getTime() + days * 24 * 60 * 60 * 1000
    );

    document.cookie =
        `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;

}

function getCookie(name) {

    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {

        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {

            return decodeURIComponent(
                cookie.substring(name.length + 1)
            );

        }

    }

    return null;

}

/* ==========================================================
   SAVE / LOAD PROGRESS
========================================================== */

function loadProgress() {

    const saved = getCookie(COOKIE_NAME);

    if (!saved) {

        completed = {};

        return;

    }

    try {

        completed = JSON.parse(saved);

    }

    catch {

        completed = {};

    }

}

function saveProgress() {

    setCookie(

        COOKIE_NAME,

        JSON.stringify(completed)

    );

}

/* ==========================================================
   RANDOM HELPERS
========================================================== */

function randomRotation() {

    return Math.random() * 16 - 8;

}

function randomScale() {

    return 0.95 + Math.random() * 0.10;

}

/* ==========================================================
   PASSPORT SHAKE
========================================================== */

function shakePassport() {

    board.classList.remove("passport-hit");

    void board.offsetWidth;

    board.classList.add("passport-hit");

}

/* ==========================================================
   PLAY STAMP ANIMATION
========================================================== */

function playStampAnimation(img) {

    img.style.display = "block";

    img.style.opacity = "1";

    img.style.setProperty(

        "--stamp-rotation",

        randomRotation() + "deg"

    );

    img.style.setProperty(

        "--stamp-scale",

        randomScale()

    );

    img.classList.remove("stamp-animation");

    void img.offsetWidth;

    img.classList.add("stamp-animation");

}

/* ==========================================================
   MARK A SQUARE COMPLETE
========================================================== */

function completeSquare(square, div, img, text) {

    completed[square.id] = true;

    saveProgress();

    div.classList.add("marked");

    text.classList.add("text-fade");

    setTimeout(() => {

        playStampAnimation(img);

        shakePassport();

    }, 300);

}

/* ==========================================================
   LOAD CSV
========================================================== */

async function loadCSV() {

    try {

        console.log("Loading CSV...");

        const response = await fetch("bingo.csv");

        if (!response.ok) {

            throw new Error(

                `HTTP ${response.status}`

            );

        }

        const text = await response.text();

        const rows = text.trim().split(/\r?\n/);

        rows.shift();

        bingoData = rows.map(row => {

            const cols = row.split(",");

            return {

                id: cols[0].trim(),

                task: cols[1].trim(),

                passcode: cols[2].trim(),

                png: cols[3]?.trim() || "",

                description: cols[4]?.trim() || "",

                link: cols[5]?.trim() || ""

            };

        });

        console.log(

            "Loaded",

            bingoData.length,

            "activities."

        );

        buildBoard();

    }

    catch(error){

        console.error(

            "Unable to load bingo.csv",

            error

        );

    }

}
/* ==========================================================
   BUILD BINGO BOARD
========================================================== */

function buildBoard() {

    console.log("Building bingo board...");

    board.innerHTML = "";


    bingoData.forEach(square => {


        const div = document.createElement("div");

        div.className = "square";


        /* ==================================================
           CREATE STAMP IMAGE
        ================================================== */


        const img = document.createElement("img");

        img.className = "square-icon";

        img.alt = square.task;


        if (square.png) {

            img.src = ICON_FOLDER + square.png;

        }


        /*
            Hide stamp until unlocked.
            Opacity is used instead of display:none
            so the image is already loaded.
        */

        img.style.opacity = "0";

        img.style.display = "block";


        div.appendChild(img);



        /* ==================================================
           CREATE ACTIVITY TEXT
        ================================================== */


        const text = document.createElement("div");

        text.className = "square-text";

        text.textContent = square.task;


        div.appendChild(text);



        /* ==================================================
           RESTORE SAVED PROGRESS
        ================================================== */


        if (completed[square.id]) {


            div.classList.add("marked");


            text.style.display = "none";


            img.style.opacity = "1";


            img.style.setProperty(

                "--stamp-rotation",

                randomRotation() + "deg"

            );


            img.style.setProperty(

                "--stamp-scale",

                randomScale()

            );

        }



        /* ==================================================
           CLICK EVENT
        ================================================== */


        div.addEventListener(

            "click",

            () => {


                /*
                    Prevent duplicate stamping
                */

                if (completed[square.id]) {

                    return;

                }



                /*
                    FREE SPACE
                */

                if (

                    square.passcode.toUpperCase()

                    ===

                    "FREE"

                ) {


                    completeSquare(

                        square,

                        div,

                        img,

                        text

                    );


                    return;

                }



                /*
                    ASK FOR PASSCODE
                */

                const code = prompt(

                    "Enter the 4-digit booth passcode:"

                );



                if (code === null) {

                    return;

                }



                /*
                    VALIDATE ANSWER
                */

                if (

                    code.trim()

                    ===

                    square.passcode.trim()

                ) {


                    completeSquare(

                        square,

                        div,

                        img,

                        text

                    );


                }

                else {


                    alert(

                        "Incorrect passcode."

                    );


                }


            }

        );



        board.appendChild(div);


    });


}
/* ==========================================================
   RESET CARD
========================================================== */

function resetCard() {


    const confirmReset = confirm(

        "Reset your bingo passport?"

    );


    if (!confirmReset) {

        return;

    }


    completed = {};


    saveProgress();


    buildBoard();


}



/* ==========================================================
   START APPLICATION
========================================================== */


loadProgress();


loadCSV();