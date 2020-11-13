// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var geojson;

// Process data here
d3.json(link, function(data) {

    console.log(data.features[0]);

    geojson = L.choropleth(data, {
        valueProperty: function(feature) {
            return feature.geometry.coordinates[2];
        },
        scale: ['yellow', 'green'],
        steps: 10,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 3 * Number(feature.properties.mag),
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3><a href="${feature.properties.url}" target="_blank">M ${(Math.round(feature.properties.mag * 10) / 10).toFixed(1)} ${feature.properties.type}</a></h3>` +
                `<ul><li>${feature.properties.place}</li>` +
                `<li>${new Date(feature.properties.time)}</li>` +
                `<li>${feature.geometry.coordinates[2]} km (${Math.round(feature.geometry.coordinates[2] * 100 / 1.609) / 100} mi) deep</li></ul>`);
        }
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Depth (km)</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
});

// Create a new marker
// Pass in some initial options, and then add it to the map using the addTo method
// var marker = L.marker([45.52, -122.67], {
//     draggable: true,
//     title: "My First Marker"
// }).addTo(myMap);

// Binding a pop-up to our marker
//marker.bindPopup("Hello There!");