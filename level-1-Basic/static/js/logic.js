// Create map object
var myMap = L.map("map", {
	center: [37.09, -95.71],
	zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
	accessToken: API_KEY
}).addTo(myMap);

var url_earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Grab data with d3
d3.json(url_earthquakes).then(function(data) {
   

});



