console.log("Loading map CSV...");

const festivalMap = document.getElementById("festivalMap");

let mapLocations = [];

let mapNaturalWidth = 0;
let mapNaturalHeight = 0;

let selectedIcon = null;


// ==========================================
// LOAD MAP CSV
// ==========================================

fetch("map.csv")

.then(response => {

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.text();

})

.then(csvText => {

    const rows = csvText
        .trim()
        .split("\n");

    const headers = rows[0]
        .split(",")
        .map(header => header.trim());


    mapLocations = rows
        .slice(1)
        .map(line => {

            const values = line
                .split(",")
                .map(value => value.trim());

            const location = {};

            headers.forEach((header, index) => {

                location[header] =
                    values[index] || "";

            });

            return location;

        });


    console.log(
        "Loaded map locations:",
        mapLocations
    );


    // Build the directory immediately
    buildDirectory();


    // Wait for map image before rendering icons
    initializeMap();

})

.catch(error => {

    console.error(
        "Error loading map.csv:",
        error
    );

});


// ==========================================
// INITIALIZE MAP
// ==========================================

function initializeMap() {

    if (festivalMap.complete &&
        festivalMap.naturalWidth > 0) {

        setupMap();

    } else {

        festivalMap.addEventListener(
            "load",
            setupMap,
            { once: true }
        );

    }

}


// ==========================================
// GET ORIGINAL MAP DIMENSIONS
// ==========================================

function setupMap() {

    mapNaturalWidth =
        festivalMap.naturalWidth;

    mapNaturalHeight =
        festivalMap.naturalHeight;


    console.log(
        "Map natural size:",
        mapNaturalWidth,
        "x",
        mapNaturalHeight
    );


    renderMapIcons();

}


// ==========================================
// RENDER MAP ICONS
// ==========================================

function renderMapIcons() {

    const mapIcons =
        document.getElementById("mapIcons");


    if (!mapIcons) {

        console.error(
            "Could not find #mapIcons"
        );

        return;

    }


    // Remove existing icons
    mapIcons.innerHTML = "";


    if (!mapNaturalWidth ||
        !mapNaturalHeight) {

        console.warn(
            "Map dimensions are not ready."
        );

        return;

    }


    const scaleX =
        festivalMap.clientWidth /
        mapNaturalWidth;


    const scaleY =
        festivalMap.clientHeight /
        mapNaturalHeight;


    console.log(
        "Map scale:",
        scaleX,
        scaleY
    );


    mapLocations.forEach(
        (location, index) => {


            const icon =
                document.createElement("img");


            icon.src =
                `assets/icons/${location.icon}.png`;


            icon.className =
                "mapIcon";


            icon.dataset.index =
                index;


            // Scale original CSV coordinates
            icon.style.left =
                `${Number(location.x) * scaleX}px`;


            icon.style.top =
                `${Number(location.y) * scaleY}px`;


            icon.alt =
                location.place;


            icon.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    selectIcon(index);

                    showPopup(location);

                }
            );


            mapIcons.appendChild(icon);


        }
    );


    console.log(
        "Rendered map icons:",
        mapIcons.children.length
    );

}


// ==========================================
// BUILD DIRECTORY
// ==========================================

function buildDirectory() {

    const directory =
        document.getElementById(
            "mapDirectory"
        );


    if (!directory) {

        console.error(
            "Could not find #mapDirectory"
        );

        return;

    }


    directory.innerHTML = "";


    const zones = {};


    mapLocations.forEach(location => {

        if (!zones[location.zone]) {

            zones[location.zone] = [];

        }

        zones[location.zone].push(
            location
        );

    });


    Object.keys(zones)
        .forEach(zone => {


            const section =
                document.createElement("div");


            section.className =
                "mapZone";


            const title =
                document.createElement("h3");


            title.textContent =
                zone;


            section.appendChild(title);


            zones[zone].forEach(
                location => {


                    const item =
                        document.createElement(
                            "button"
                        );


                    item.className =
                        "mapLocation";


                    item.textContent =
                        location.place;


                    item.dataset.index =
                        mapLocations.indexOf(
                            location
                        );


                    item.addEventListener(
                        "click",
                        () => {


                            const index =
                                Number(
                                    item.dataset.index
                                );


                            selectIcon(index);

                            showPopup(
                                location
                            );


                        }
                    );


                    section.appendChild(
                        item
                    );


                }
            );


            directory.appendChild(
                section
            );


        });

}


// ==========================================
// SELECT MAP ICON
// ==========================================

function selectIcon(index) {

    const icons =
        document.querySelectorAll(
            ".mapIcon"
        );


    icons.forEach(icon => {

        icon.classList.remove(
            "selected"
        );

    });


    const selected =
        document.querySelector(
            `.mapIcon[data-index="${index}"]`
        );


    if (!selected) {

        console.warn(
            "Map icon not found for index:",
            index
        );

        return;

    }


    selected.classList.add(
        "selected"
    );


    selectedIcon =
        selected;


    // Highlight directory item too
    const directoryItem =
        document.querySelector(
            `.mapLocation[data-index="${index}"]`
        );


    document
        .querySelectorAll(".mapLocation")
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    if (directoryItem) {

        directoryItem.classList.add(
            "selected"
        );

    }

}


// ==========================================
// POPUP
// ==========================================

function showPopup(location) {

    const popup =
        document.getElementById(
            "mapPopup"
        );


    const title =
        document.getElementById(
            "popupTitle"
        );


    const description =
        document.getElementById(
            "popupDescription"
        );


    const image =
        document.getElementById(
            "popupImage"
        );


    const link =
        document.getElementById(
            "popupLink"
        );


    title.textContent =
        location.place;


    description.textContent =
        location.description;


    // Image
    if (
        location.image &&
        location.image.toLowerCase() !== "na"
    ) {

        image.src =
            `assets/${location.image}`;

        image.alt =
            location.place;

        image.style.display =
            "block";

    } else {

        image.style.display =
            "none";

    }


    // Link
    if (
        location.link &&
        location.link.toLowerCase() !== "na"
    ) {

        link.href =
            location.link;

        link.style.display =
            "inline-block";

    } else {

        link.style.display =
            "none";

    }


    popup.classList.remove(
        "hidden"
    );

}


// ==========================================
// CLOSE POPUP
// ==========================================

document
    .getElementById("closePopup")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("mapPopup")
                .classList.add(
                    "hidden"
                );

        }
    );


// ==========================================
// RESIZE MAP / REPOSITION ICONS
// ==========================================

window.addEventListener(
    "resize",
    () => {

        if (
            mapNaturalWidth &&
            mapNaturalHeight
        ) {

            renderMapIcons();

        }

    }
);