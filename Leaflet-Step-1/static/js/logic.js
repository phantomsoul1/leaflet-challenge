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

// Process data here
d3.json(link, function(data) {
    console.log(data);

    var type = data.type;
    var metadata = data.metadata;
    var features = data.features;

    console.log(features[0].properties);

    L.geoJson(features, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 3 * Number(feature.properties.mag),
                fillColor: 'green',
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<p class='info header'>${feature.properties.title}</p>`);
        }
    }).addTo(myMap);
});

// Create a new marker
// Pass in some initial options, and then add it to the map using the addTo method
// var marker = L.marker([45.52, -122.67], {
//     draggable: true,
//     title: "My First Marker"
// }).addTo(myMap);

// Binding a pop-up to our marker
//marker.bindPopup("Hello There!");