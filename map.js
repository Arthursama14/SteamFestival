const icon = document.createElement("img");

icon.src = `assets/icons/${row.icon}`;

icon.className = "mapIcon";

icon.style.left = row.x + "px";

icon.style.top = row.y + "px";