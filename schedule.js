const CSV_FILE = "schedule.csv";
const scheduleContainer = document.getElementById("schedule");

/**
 * Convert "10:30 AM" to minutes after midnight
 */
function timeToMinutes(timeString) {

    if (!timeString) return 0;

    const [clock, period] = timeString.trim().split(/\s+/);

    let [hour, minute] = clock.split(":").map(Number);

    if (period.toUpperCase() === "PM" && hour !== 12)
        hour += 12;

    if (period.toUpperCase() === "AM" && hour === 12)
        hour = 0;

    return hour * 60 + minute;

}

/**
 * Convert minutes into readable countdown text
 */
function minutesToText(minutes) {

    if (minutes <= 0)
        return "Now";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0)
        return `${hours} hr ${mins} min`;

    if (hours > 0)
        return `${hours} hr`;

    return `${mins} min`;

}

/**
 * Parse one row from the CSV
 */
function parseRow(row) {

    const timeRange = row[0]?.trim();
    const title = row[1]?.trim() || "";
    const location = row[2]?.trim() || "";
    const description = row[3]?.trim() || "";

    const [startString, endString] =
        timeRange.split(/\s*[-–—]\s*/);

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
 * Parse TSV or CSV
 */
function parseCSV(text) {

    const lines = text.trim().split(/\r?\n/);

    // Remove header
    lines.shift();

    const events = [];

    lines.forEach(line => {

        if (line.trim() === "")
            return;

        // Split by TAB first, otherwise comma
        const values = line.includes("\t")
            ? line.split("\t")
            : line.split(",");

        try {

            events.push(parseRow(values));

        } catch (err) {

            console.warn("Skipping malformed row:", line);

        }

    });

    // Ensure chronological order
    events.sort((a, b) => a.start - b.start);

    return events;

}

/**
 * Current time
 */
function getCurrentMinutes() {

    const now = new Date();

    return now.getHours() * 60 + now.getMinutes();

}

/**
 * Build one event card
 */
function createEventCard(event, currentMinutes) {

    const card = document.createElement("div");
    card.className = "schedule-event";

    const title = document.createElement("h3");
    const time = document.createElement("p");
    const location = document.createElement("p");
    const description = document.createElement("p");
    const countdown = document.createElement("p");

    title.textContent = event.title;
    time.textContent = event.timeRange;
    location.textContent = "📍 " + event.location;
    description.textContent = event.description;

    if (
        currentMinutes >= event.start &&
        currentMinutes < event.end
    ) {

        card.classList.add("current");

        countdown.textContent =
            `⏳ Ends in ${minutesToText(event.end - currentMinutes)}`;

    } else {

        countdown.textContent =
            `🕒 Starts in ${minutesToText(event.start - currentMinutes)}`;

    }

    countdown.className = "countdown";

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(location);
    card.appendChild(description);
    card.appendChild(countdown);

    return card;

}

/**
 * Draw the schedule
 */
function renderSchedule(events) {

    scheduleContainer.innerHTML = "";

    const currentMinutes = getCurrentMinutes();

    // Remove finished events
    const remaining = events.filter(event =>
        event.end > currentMinutes
    );

    if (remaining.length === 0) {

        scheduleContainer.innerHTML =
            "<h2>🎉 Thanks for attending! Today's schedule has concluded.</h2>";

        return;

    }

    // Current Event Heading
    const current = remaining.find(event =>
        currentMinutes >= event.start &&
        currentMinutes < event.end
    );

    if (current) {

        const heading = document.createElement("h2");
        heading.textContent = "🟢 Happening Now";
        scheduleContainer.appendChild(heading);

        scheduleContainer.appendChild(
            createEventCard(current, currentMinutes)
        );

    }

    const upcoming = remaining.filter(event =>
        currentMinutes < event.start
    );

    if (upcoming.length > 0) {

        const heading = document.createElement("h2");
        heading.textContent = "📅 Up Next";
        heading.style.marginTop = "30px";

        scheduleContainer.appendChild(heading);

        upcoming.forEach(event => {

            scheduleContainer.appendChild(

                createEventCard(event, currentMinutes)

            );

        });

    }

}

/**
 * Load CSV
 */
async function loadSchedule() {

    try {

        const response = await fetch(CSV_FILE);

        if (!response.ok)
            throw new Error("Could not load schedule.");

        const text = await response.text();

        const events = parseCSV(text);

        renderSchedule(events);

    } catch (error) {

        console.error(error);

        scheduleContainer.innerHTML =
            "<h2>Unable to load today's schedule.</h2>";

    }

}

/**
 * Initial load
 */
loadSchedule();

/**
 * Refresh every minute
 */
setInterval(loadSchedule, 60000);