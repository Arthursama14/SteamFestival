const COOKIE_NAME = "stemFestivalBingo";

let bingoData = [];
let completed = {};

const board = document.getElementById("bingo");

/* ==========================================
   COOKIE FUNCTIONS
========================================== */

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

/* ==========================================
   LOAD / SAVE PROGRESS
========================================== */

function loadProgress() {

    const saved = getCookie(COOKIE_NAME);

    if (saved) {

        try {

            completed = JSON.parse(saved);

        }

        catch {

            completed = {};

        }

    }

}

function saveProgress() {

    setCookie(
        COOKIE_NAME,
        JSON.stringify(completed)
    );

}

/* ==========================================
   LOAD CSV
========================================== */

async function loadCSV() {

    try {

        console.log("Loading CSV...");

        const response = await fetch("bingo.csv");

        console.log("CSV status:", response.status);


        const text = await response.text();

        console.log("CSV contents:");
        console.log(text);


        const rows = text.trim().split(/\r?\n/);

        console.log("Rows found:", rows.length);


        rows.shift();


        bingoData = rows.map(row => {

            const cols = row.split(",");

            return {

                id: cols[0].trim(),

                task: cols[1].trim(),

                passcode: cols[2].trim(),

                png: cols[3]?.trim() || ""

            };

        });


        console.log("Parsed bingo data:");
        console.log(bingoData);


        buildBoard();

    }

    catch(error){

        console.error("CSV loading failed:", error);

    }

}

/* ==========================================
   BUILD BOARD
========================================== */

function buildBoard() {

    console.log("Building board...");

    board.innerHTML = "";

    bingoData.forEach(square => {

        const div = document.createElement("div");

        div.className = "square";

        /* ---------- ICON ---------- */

        if (square.png) {

            const img = document.createElement("img");

            img.src = "assets/icons/" + square.png + ".png";;

            img.className = "square-icon";

            img.alt = square.task;

            div.appendChild(img);

        }

        /* ---------- TEXT ---------- */

        const text = document.createElement("div");

        text.className = "square-text";

        text.textContent = square.task;

        div.appendChild(text);

        if (completed[square.id]) {

            div.classList.add("marked");

        }

        div.addEventListener("click", () => {

            if (completed[square.id])
                return;

            if (square.passcode.toUpperCase() === "FREE") {

                completed[square.id] = true;

                saveProgress();

                div.classList.add("marked");

                return;

            }

            const code = prompt("Enter the 4-digit booth passcode:");

            if (code === null)
                return;

            if (code.trim() === square.passcode) {

                completed[square.id] = true;

                saveProgress();

                div.classList.add("marked");

                alert("Correct!");

            }
            else {

                alert("Incorrect passcode.");

            }

        });

        board.appendChild(div);

    });

}

/* ==========================================
   RESET CARD
========================================== */

function resetCard() {

    if (!confirm("Reset your bingo card?"))
        return;

    completed = {};

    saveProgress();

    buildBoard();

}

/* ==========================================
   STARTUP
========================================== */

loadProgress();

loadCSV();