// Initialize the map
const map = L.map('map').setView([10.779500658839039, 106.69455401186707], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Define places (latitude, longitude, and name)
const places = [
    {lat: 10.779500658839039, lng: 106.69455401186707, name: "Trung học Phổ thông Lê Quý Đôn"},
    {lat: 10.788096920212489, lng: 106.70472374365906, name: "Bảo tàng lịch sử Thành phố Hồ Chí Minh"},
    {lat: 10.776179477316843, lng: 106.69956640372878, name: "Bảo tàng Thành phố Hồ Chí Minh"},
    {lat: 10.777194441801058, lng: 106.69530209507617, name: "Dinh Độc Lập"},
    {lat: 10.78722735287649, lng: 106.70424085274605, name: "Bảo tàng Chiến dịch Hồ Chí Minh"},
    {lat: 10.783955312882366, lng: 106.68756832206712, name: "Bảo tàng Phụ nữ Nam bộ"},
    {lat: 10.800159632489438, lng: 106.66620205274626, name: "Bảo tàng Lực lượng Vũ trang Miền Đông Nam Bộ"},
    {lat: 10.777583297879925, lng: 106.70660543740647, name: "Bảo tàng Tôn Đức Thắng"},
    {lat: 10.769077091752367, lng: 106.70674696718258, name: "Bến Nhà Rồng - Bảo tàng Hồ Chí Minh"},
    {lat: 10.780227286297539, lng: 106.69196285184316, name: "Bảo tàng Chứng tích Chiến tranh"}
];

let routingControl = null;
let startPoint = null;

// Add markers for each place
places.forEach((place, index) => {
    const marker = L.marker([place.lat, place.lng])
        .bindPopup(`<b>${place.name}</b>`)
        .addTo(map);

    // Set first marker as initial start point
    if (index === 0) {
        startPoint = L.latLng(place.lat, place.lng);
        marker.bindPopup(`<b>${place.name}</b><br>Điểm bắt đầu`, {closeOnClick: false, autoClose: false}).openPopup();
    }

    // Click handler for markers
    marker.on('click', () => {
        if (index !== 0) { // Prevent routing from start point to itself
            const endPoint = L.latLng(place.lat, place.lng);

            // Remove existing route if any
            if (routingControl) {
                map.removeControl(routingControl);
            }

            // Close other popups
            places.forEach(p => map.closePopup());

            // Create new route
            routingControl = L.Routing.control({
                waypoints: [
                    startPoint,
                    endPoint
                ],
                routeWhileDragging: true,
                show: false, // Hide alternative routes
                addWaypoints: false, // Disable adding new waypoints
                draggableWaypoints: false,
                lineOptions: {
                    styles: [{ color: '#3388ff', opacity: 1, weight: 10 }]
                }
            }).addTo(map);

            // Add route information
            routingControl.on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                alert(`Đã tìm thấy đường! Khoảng cách: ${(summary.totalDistance / 1000).toFixed(2)} km`);
            });

            // Reopen the popup to show destination information
            marker.openPopup();
        }
    });
});

// Add geolocation button
const locateButton = L.control({position: 'topright'});
locateButton.onAdd = function() {
    this.div = L.DomUtil.create('div', 'map-control');
    this.div.innerHTML = '<button onclick="locateUser()">Locate Me</button>';
    return this.div;
};
locateButton.addTo(map);

// Geolocation function
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = [position.coords.latitude, position.coords.longitude];
                map.setView(userLocation, 13);
            });
        }
    }
