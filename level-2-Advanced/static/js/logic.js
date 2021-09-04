// Add multiple tile layers
function createMap(GeoJsonLayer, platesLayer){
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    // Create a baseMaps object
    var baseMaps = {
        Satellite: satelliteMap,
        Outdoors: outdoorsMap,
        Grayscale: grayscaleMap
    };

    // Create an overlayMaps object
    var overlayMaps = {
        'Fault Lines': platesLayer,
        Earthquakes: GeoJsonLayer
    }

    // Define a myMap object
    var myMap = L.map('map',{
        center:[37.0902, -95.7129],
        zoom: 5,
        layers: [satelliteMap, platesLayer, GeoJsonLayer]
    })
        
    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    return myMap;
}

// Function for creating GeoJSON layer
function createGeoJsonLayer(data){
    var GeoJsonLayer = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                //radius: getRadius(feature.properties.mag),
                //fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    })
    return GeoJsonLayer;
}


// File path for the Data on tectonic plates
var platesJsonPath = "static/data/PB2002_plates.json"
d3.json(platesJsonPath).then(function(platesData){
    var platesLayer = L.geoJson(platesData,{
        style: function(feature) {
            return {
                color: "#F0ED0E",
                fillColor: "white",
                fillOpacity:0
            };
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<span>Plate: ${feature.properties.PlateName}</span>`)
        }
    })
    
    var GeoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    d3.json(GeoJSONUrl).then(function(earthquakeData){
        
        var GeoJsonLayer = createGeoJsonLayer(earthquakeData);
        var myMap = createMap(GeoJsonLayer,platesLayer);
        createLegend(myMap)
});
})
