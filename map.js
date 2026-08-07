const festivalMap = document.getElementById("festivalMap");

let mapNaturalWidth = 0;
let mapNaturalHeight = 0;

console.log("Loading map CSV...");

let mapLocations = [];

let selectedIcon = null;


// ================================
// LOAD MAP CSV
// ================================

fetch("map.csv")

.then(response => response.text())

.then(csvText => {


    const rows = csvText
        .trim()
        .split("\n");


    const headers = rows[0]
        .split(",");


    mapLocations = rows
        .slice(1)
        .map(line => {


            const values = line.split(",");


            let item = {};


            headers.forEach((header, index) => {

                item[header.trim()] =
                    values[index]?.trim();

            });


            return item;


        });


    console.log("Loaded map locations:", mapLocations);


    festivalMap.onload = () => {

    mapNaturalWidth =
        festivalMap.naturalWidth;


    mapNaturalHeight =
        festivalMap.naturalHeight;


    console.log(
        "Map size:",
        mapNaturalWidth,
        mapNaturalHeight
    );


    renderMapIcons();

};


buildDirectory();


})

.catch(error => {

    console.error(
        "Error loading map.csv:",
        error
    );

});




function renderMapIcons(){


    const mapIcons =
        document.getElementById("mapIcons");


    mapIcons.innerHTML = "";


    const scaleX =
        festivalMap.clientWidth /
        mapNaturalWidth;


    const scaleY =
        festivalMap.clientHeight /
        mapNaturalHeight;



    mapLocations.forEach((location, index)=>{


        const icon =
            document.createElement("img");


        icon.src =
            `assets/icons/${location.icon}.png`;


        icon.className =
            "mapIcon";


        icon.dataset.index =
            index;



        // Scale CSV coordinates
        icon.style.left =
            (location.x * scaleX) + "px";


        icon.style.top =
            (location.y * scaleY) + "px";



        icon.addEventListener(
            "click",
            ()=>{


                selectIcon(index);

                showPopup(location);


            }
        );



        mapIcons.appendChild(icon);


    });

}

// ================================
// BUILD DIRECTORY BY ZONE
// ================================

function buildDirectory(){


    const directory =
        document.getElementById(
            "mapDirectory"
        );


    const zones = {};


    mapLocations.forEach(location=>{


        if(!zones[location.zone]){

            zones[location.zone] = [];

        }


        zones[location.zone]
            .push(location);


    });



    Object.keys(zones)
    .forEach(zone=>{


        const section =
            document.createElement("div");


        section.className =
            "mapZone";


        const title =
            document.createElement("h3");


        title.textContent =
            zone;


        section.appendChild(title);



        zones[zone]
        .forEach(location=>{


            const item =
                document.createElement("button");


            item.className =
                "mapLocation";


            item.textContent =
                location.place;



            item.addEventListener(
                "click",
                ()=>{


                    const index =
                        mapLocations.indexOf(
                            location
                        );


                    selectIcon(index);

                    showPopup(location);


                }
            );


            section.appendChild(item);


        });


        directory.appendChild(section);


    });


}





// ================================
// HIGHLIGHT ICON
// ================================

function selectIcon(index) {

    const icons = document.querySelectorAll(".mapIcon");

    // Remove selection from all icons
    icons.forEach(icon => {
        icon.classList.remove("selected");
    });

    // Make sure the requested icon exists
    if (!icons[index]) {
        console.warn("Map icon not found for index:", index);
        return;
    }

    // Highlight selected icon
    icons[index].classList.add("selected");

    selectedIcon = icons[index];
}



// ================================
// POPUP
// ================================

function showPopup(location){


    const popup =
        document.getElementById(
            "mapPopup"
        );


    document.getElementById(
        "popupTitle"
    ).textContent =
        location.place;



    document.getElementById(
        "popupDescription"
    ).textContent =
        location.description;



    const image =
        document.getElementById(
            "popupImage"
        );


    if(
        location.image &&
        location.image !== "na"
    ){

        image.src =
            `assets/${location.image}`;

        image.style.display =
            "block";

    }

    else{

        image.style.display =
            "none";

    }



    const link =
        document.getElementById(
            "popupLink"
        );


    if(
        location.link &&
        location.link !== "na"
    ){

        link.href =
            location.link;

        link.style.display =
            "inline";

    }

    else{

        link.style.display =
            "none";

    }



    popup.classList.remove(
        "hidden"
    );


}





// ================================
// CLOSE POPUP
// ================================

document
.getElementById("closePopup")
.addEventListener(
    "click",
    ()=>{


        document
        .getElementById("mapPopup")
        .classList.add(
            "hidden"
        );


    }
);

window.addEventListener(
    "resize",
    ()=>{


        if(mapNaturalWidth){

            renderMapIcons();

        }


    }
);