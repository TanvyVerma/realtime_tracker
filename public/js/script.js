const socket = io();
const map = L.map("map").setView([20, 77], 5); // default view India
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Object to store markers of all users
const markers = {};

// Send my location to server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });

        // Show my marker (blue)
        if (!markers["me"]) {
            markers["me"] = L.marker([latitude, longitude], { title: "Me" }).addTo(map);
        } else {
            markers["me"].setLatLng([latitude, longitude]);
        }

        map.setView([latitude, longitude], 12);
    });
}

// Receive other users' locations
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // If marker for this user doesn’t exist → create
    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude], { title: id }).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
});

// Remove user marker when they disconnect
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
