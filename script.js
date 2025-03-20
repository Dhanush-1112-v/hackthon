let events = [
    { title: "Ganesh Chaturthi", lat: 17.3850, lng: 78.4867, img: "https://th.bing.com/th/id/OIP.hNPsCwJS0otDzsUHG4YSigHaEK?w=293&h=180", city: "Hyderabad" },
    { title: "Holi Celebrations", lat: 17.3700, lng: 78.4800, img: "https://th.bing.com/th/id/OIP.HcM1YR6z3A3ZNWCtB-NYuQHaE7?w=252&h=180", city: "Gachibowli" },
    { title: "Diwali Mela", lat: 17.4000, lng: 78.4500, img: "https://th.bing.com/th/id/OIP.oLNHbpgAbvKvVlkeOIumWgHaEJ?w=280&h=180", city: "Charminar" },
    { title: "Dussehra Festival", lat: 17.4200, lng: 78.4600, img: "https://1.bp.blogspot.com/-9BWjAMmxin4/TmPJi5zBUAI/AAAAAAAADYE/akLisktbc6Y/s1600/dussehra-celebration.jpg", city: "Hyderabad" },
    { title: "Bonalu Festival", lat: 17.3900, lng: 78.4700, img: "https://th.bing.com/th/id/OIP.DvBp-tjbNKhZ6k9tfNqBfwHaE8?rs=1&pid=ImgDetMain", city: "Secunderabad" }
];

function initMap() {
    let map = L.map('map').setView([17.3850, 78.4867], 12);

    // Load OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    getUserLocation(map);
}

function getUserLocation(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                let userLat = position.coords.latitude;
                let userLng = position.coords.longitude;

                document.getElementById("locationStatus").innerText = "Showing events near your location.";

                // Add user location marker
                L.marker([userLat, userLng], { icon: userIcon() }).addTo(map)
                    .bindPopup("You are here")
                    .openPopup();

                filterEventsByLocation(userLat, userLng, map);
            },
            () => {
                document.getElementById("locationStatus").innerText = "Location access denied. Showing all events.";
                loadEvents(events, map);
            }
        );
    } else {
        document.getElementById("locationStatus").innerText = "Geolocation not supported.";
        loadEvents(events, map);
    }
}

function userIcon() {
    return L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        iconSize: [30, 30]
    });
}

function filterEventsByLocation(userLat, userLng, map) {
    let filteredEvents = events.filter(event => getDistance(userLat, userLng, event.lat, event.lng) <= 50);
    loadEvents(filteredEvents, map);
}

function loadEvents(eventList, map) {
    let eventContainer = document.getElementById("eventContainer");
    eventContainer.innerHTML = "";

    eventList.forEach(event => {
        L.marker([event.lat, event.lng]).addTo(map)
            .bindPopup(`<strong>${event.title}</strong><br>Location: ${event.city}`)
            .on('click', () => openRSVPModal(event.title));

        let card = document.createElement("div");
        card.classList.add("event-card");
        card.innerHTML = `
            <img src="${event.img}" alt="${event.title}">
            <h3>${event.title}</h3>
            <p>Location: ${event.city}</p>
            <button class="join-btn">Join Event</button>
        `;

        eventContainer.appendChild(card);
    });

    document.querySelectorAll(".join-btn").forEach(button => {
        button.addEventListener("click", function () {
            window.location.href = "rsvp.html"; // Redirect to RSVP form
        });
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// RSVP Modal Handling
document.getElementById("confirmRSVP").addEventListener("click", () => {
    alert("RSVP Confirmed! Proceed to book your tickets.");
    window.location.href = "booking.html"; // Redirect to ticket booking page
});

// Show a random event popup after 5 seconds
function showPopup() {
    let popup = document.getElementById("popupNotification");
    let popupMessage = document.getElementById("popupMessage");

    let messages = [
        "🎉 Exciting Holi is awaiting! <a href='booking.html'>Book your tickets now!</a>",
        "🔥 Don't miss the Diwali Mela! <a href='booking.html'>Reserve your spot today!</a>",
        "🎭 Ganesh Chaturthi celebrations coming soon! <a href='booking.html'>Join us!</a>",
        "💃 Bonalu Festival is here! <a href='booking.html'>Secure your tickets now!</a>",
        "🎊 Dussehra Festival happening soon! <a href='booking.html'>Be part of the grand celebrations!</a>"
    ];

    let randomMessage = messages[Math.floor(Math.random() * messages.length)];
    popupMessage.innerHTML = randomMessage;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 60000);
}

// Redirect user to home.html after successful login from index.html
document.getElementById("loginForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "home.html"; // Redirect to home page after login
});

// Ensure user is logged in before accessing home.html
if (window.location.pathname.includes("home.html") && !sessionStorage.getItem("loggedIn")) {
    window.location.href = "index.html"; // Redirect to login page if not logged in
}

window.onload = function() {
    setTimeout(showPopup, 5000);
};

initMap();
