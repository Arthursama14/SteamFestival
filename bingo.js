const squares = [
"Square 1","Square 2","Square 3","Square 4","Square 5",
"Square 6","Square 7","Square 8","Square 9","Square 10",
"Square 11","Square 12","FREE","Square 14","Square 15",
"Square 16","Square 17","Square 18","Square 19","Square 20",
"Square 21","Square 22","Square 23","Square 24","Square 25"
];

const COOKIE_NAME = "bingoState";

const board = document.getElementById("bingo");

let state = new Array(25).fill(false);

// ------------------------
// Cookie Functions
// ------------------------

function setCookie(name, value, days=365){
    const date = new Date();
    date.setTime(date.getTime() + days*24*60*60*1000);

    document.cookie =
        `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

function getCookie(name){
    const cookies = document.cookie.split(";");

    for(let cookie of cookies){

        cookie = cookie.trim();

        if(cookie.startsWith(name + "=")){
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }

    return null;
}

// ------------------------
// Save / Load
// ------------------------

function saveState(){
    setCookie(COOKIE_NAME, JSON.stringify(state));
}

function loadState(){

    const saved = getCookie(COOKIE_NAME);

    if(saved){

        try{
            const parsed = JSON.parse(saved);

            if(parsed.length === 25){
                state = parsed;
            }

        }catch(e){}
    }
}

// ------------------------
// Build Board
// ------------------------

function buildBoard(){

    board.innerHTML = "";

    squares.forEach((text,index)=>{

        const div = document.createElement("div");

        div.className = "square";

        if(state[index])
            div.classList.add("marked");

        div.innerText = text;

        div.addEventListener("click",()=>{

            state[index] = !state[index];

            div.classList.toggle("marked");

            saveState();

        });

        board.appendChild(div);

    });

}

// ------------------------
// Reset
// ------------------------

function resetCard(){

    if(confirm("Reset the bingo card?")){

        state = new Array(25).fill(false);

        saveState();

        buildBoard();

    }

}

// Load existing cookie

loadState();

buildBoard();