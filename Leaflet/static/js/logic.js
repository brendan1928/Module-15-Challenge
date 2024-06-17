//create map
let myMap = L.map("map", {
    center: [37.77, -122.414],
    zoom: 11
});

//add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function chooseColour(depth) {
    if (depth > -10 && depth <=10) return "green";
    else if (depth > 10 && depth <=30) return "chartreuse";
    else if (depth > 30 && depth <=50) return "yellow";
    else if (depth > 50 && depth <=70) return "orange";
    else if (depth > 70 && depth <=90) return "red";
    else return "darkred";
  }


//d3
d3.json(url).then(function(response) {

    let markers = L.markerClusterGroup();
    response.features.forEach(function(feature) {

       //get earthquake info
        let coordinates = feature.geometry.coordinates;
        let latitude = coordinates[1];
        let longitude = coordinates[0];
        let magnitude = feature.properties.mag;
        let name = feature.properties.place;
        let depth = coordinates[2];

        // Create a circle marker and bind a popup
        let marker = L.circleMarker([latitude, longitude], {
            radius: magnitude*10,
            fillColor: chooseColour(depth),
            color: chooseColour(depth),
            weight: 1,
            opacity: 1, 
            fillOpacity: 0.6 
        }).bindPopup(`<h3>${name}</h3><br>Magnitude: ${magnitude} Depth: ${depth}`);

        //mouseover popups
        marker.on('mouseover', function() {
            this.openPopup();
        });
        marker.on('mouseout', function() {
            this.closePopup();
        });
        // Add the marker to the marker cluster group
        markers.addLayer(marker);
    });
    
    let legend = L.control({ position: "bottomright" });
    
    //create legend
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let colourscale = [-10, 10, 30, 50, 70, 90];
        let colours = ["green","chartreuse","yellow","orange","red","darkred"]
        let labels = [];

        //title
        div.innerHTML += "<h4>Earthquake Colours</h4>";

        // Generate labels with color samples
        for (let i = 0; i < colourscale.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColour(colourscale[i] + 1) + '"></i> ' +
                colourscale[i] + (colourscale[i + 1] ? '&ndash;' + colourscale[i + 1] + '<br>' : '+');
        }
        return div;
    };

    //add legend
    legend.addTo(myMap);
  
    //add markers
    myMap.addLayer(markers);
});