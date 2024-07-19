// Creating the map object
let quakeMap = L.map('map').setView([20, 0], 2);

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(quakeMap);

function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function markerColor(depth) {
    return depth > 90 ? 'darkred' :
        depth > 70 ? 'orangered' :
        depth > 50 ? 'orange' :
        depth > 30 ? 'yellow' :
        depth > 10 ? 'lightgreen' :
                        'darkgreen';
}

// Use this link to get the GeoJSON data (all from past 7 days).
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link).then(function(data) {
    // Create a GeoJSON layer with the data
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup('<h3>' + feature.properties.place + '</h3><hr><p>Magnitude: ' + feature.properties.mag + '</p><p>Depth: ' + feature.geometry.coordinates[2] + ' km</p>');
        }
    }).addTo(quakeMap);
});

// Set up the legend.
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
let depthRanges = [
    {limit: 0, color: 'darkgreen', label: "<10 km"},
    {limit: 10, color: 'lightgreen', label: "10-30 km"},
    {limit: 30, color: 'yellow', label: "30-50 km"},
    {limit: 50, color: 'orange', label: "50-70 km"},
    {limit: 70, color: 'orangered', label: "70-90 km"},
    {limit: 90, color: 'darkred', label: ">90 km"}
];
}

legend.addTo(quakeMap);