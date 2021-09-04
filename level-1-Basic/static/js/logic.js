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

var url_earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Function to determine circle color based on the magnitude 
function chooseColor(magnitude) {
    switch(true) {
      case magnitude > 5:
        return "red";
      case magnitude > 4:
        return "orangered";
      case magnitude > 3:
        return "orange";
      case magnitude > 2:
        return "gold";
      case magnitude > 1:
        return "yellow";
      default:
        return "lightgreen";
    }
  }

// Function to determine circle radius based on the magnitude 
function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 5;
            break;
        case (magnitude <= 2):
            return 7;
            break;
        case (magnitude <= 3):
            return 9;
            break;
        case (magnitude <= 4):
            return 11;
            break;
        case (magnitude <= 5):
            return 13;
            break;
        case (magnitude > 5):
            return 15;
            break;
        default:
            return 1;
            break;
    }
}  

// Grab data with d3
d3.json(url_earthquakes).then(function(data) {
    // Create a GeoJSON layer containing the features array
    // Each feature a popup describing the place and magnitude
    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag), // different radius for different magnitude
                fillColor: chooseColor(feature.properties.mag), // different circle colors for different magnitude
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);
    
    // Create a legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]
     
        //generate a label with a colored square for each interval
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
     }
     return div;
 };
 legend.addTo(myMap);
});



