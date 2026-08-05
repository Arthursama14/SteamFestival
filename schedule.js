const CSV_FILE = "schedule.csv";
const scheduleContainer = document.getElementById("schedule");

/**
 * Converts "9:30 AM" into minutes after midnight.
 */
function timeToMinutes(timeString) {

    const [clock, period] = timeString.trim().split(" ");

    let [hours, minutes] = clock.split(":").map(Number);

    if (period === "PM" && hours !== 12)
        hours += 12;

    if (period === "AM" && hours === 12)
        hours = 0;

    return hours * 60 + minutes;
}

/**
 * Parse one CSV row.
 */
function parseRow(row) {

    const [timeRange, title, location, description] = row;

    const [startString, endString] = timeRange.split("-");

    return {

        title,
        location,
        description,

        timeRange,

        start: timeToMinutes(startString),

        end: timeToMinutes(endString)

    };

}

/**
 * Very small CSV parser.
 * Assumes no commas inside quoted values.
 */
function parseCSV(text) {

    const lines = text.trim().split(/\r?\n/);

    lines.shift(); // Remove header

    return lines.map(line => {

        const values = line.split(",");

        return parseRow(values);

    });

}

/**
 * Current time in minutes.
 */
function getCurrentMinutes() {

    const now = new Date();

    return now.getHours() * 60 + now.getMinutes();

}

/**
 * Creates one event card.
 */
function createEventCard(event, currentMinutes) {

    const card = document.createElement("div");

    card.className = "schedule-event";

    if (
        currentMinutes >= event.start &&
        currentMinutes < event.end
    ) {

        card.classList.add("current");

    }

    const title = document.createElement("h3");
    title.textContent = event.title;

    const time = document.createElement("p");
    time.textContent = event.timeRange;

    const location = document.createElement("p");
    location.textContent = "📍 " + event.location;

    const description = document.createElement("p");
    description.textContent = event.description;

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(location);
    card.appendChild(description);

    return card;

}

/**
 * Draw schedule.
 */
function renderSchedule(events) {

    scheduleContainer.innerHTML = "";

    const currentMinutes = getCurrentMinutes();

    const remainingEvents = events.filter(event => {

        return event.end > currentMinutes;

    });

    if (remainingEvents.length === 0) {

        scheduleContainer.innerHTML =
            "<h2>🎉 Today's schedule has concluded.</h2>";

        return;

    }

    remainingEvents.forEach(event => {

        scheduleContainer.appendChild(

            createEventCard(event, currentMinutes)

        );

    });

}

/**
 * Loads CSV.
 */
async function loadSchedule() {

    try {

        const response = await fetch(CSV_FILE);

        const csv = await response.text();

        const events = parseCSV(csv);

        renderSchedule(events);

    }

    catch (error) {

        console.error(error);

        scheduleContainer.innerHTML =
            "<h2>Unable to load schedule.</h2>";

    }

}

/**
 * Initial load.
 */
loadSchedule();

/**
 * Refresh every minute.
 */
setInterval(loadSchedule, 60000);