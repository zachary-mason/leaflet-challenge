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
    let colors = ['#00ff00', '#ccff00', '#ffff00', '#ffd700', '#ffa500', '#ff0000'];
    if (depth < 10) return colors[0];
    else if (depth < 30) return colors[1];
    else if (depth < 50) return colors[2];
    else if (depth < 70) return colors[3];
    else if (depth < 90) return colors[4];
    else return colors[5];
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
    let div = L.DomUtil.create("div", "info legend");
    div.style.backgroundColor = "white"; // background color
    div.style.padding = "10px";
    let labels = [0, 10, 30, 50, 70, 90];
    let colors = ['#00ff00', '#ccff00', '#ffff00', '#ffd700', '#ffa500', '#ff0000'];

// Loop through depthRanges and generate the HTML for each color/label
for (let i = 0; i < labels.length; i++) {
    div.innerHTML +=
        '<i style="background-color:' + colors[i] + '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
        labels[i] + (labels[i + 1] ? '&ndash;' + labels[i + 1] + ' km<br>' : '+ km');
}
return div;
};

// adding legend to map
legend.addTo(quakeMap);