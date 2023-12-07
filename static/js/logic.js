//  Create map object
let myMap = L.map("map", {
    center: [36.12, -97.05],
    zoom: 5
});

//  Add Title layer
//  addto() to add objects to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//  Store endpoint in a variable- 2.5 week geoJSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"



//  Perform GET request 
d3.json(url).then(function(data){
    console.log(data);

    let markers = [];

    for(let i = 0; i< data.features.length; i++) {
        let feature = data.features[i];
        let location = feature.geometry.coordinates;
        if (location) {
            let circle = L.circle([location[1], location[0]], {
                fillOpacity: 0.74,
                color: "white",
                fillColor: depthColor(location[2]),
                radius: magSize(feature.properties.mag)
            }).bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3>Magnitude: ${feature.properties.mag}</h3>`);
            markers.push(circle);
        }
    }

    //  Create layer group from markers
    let quakeLayer = L.layerGroup(markers);
    quakeLayer.addTo(myMap);
});



//  Define function for marker size based on magnitude
function magSize(magnitude){
    return magnitude * 10000;
};

//Define function for marker color based on depth
function depthColor(depth) {
    if (depth >= -10 && depth <= 10) {
        return "#0ef022"; //green
    } else if (depth > 10 && depth <= 30) {
        return "greenYellow"; // Green Yellow
    } else if (depth > 30 && depth <= 50) {
        return "yellow"; // Yellow
    } else if (depth > 50 && depth <= 70) {
        return "orange"; // Orange
    } else if (depth > 70 && depth <= 90) {
        return "orangered"; // Orange Red
    } else {
        return "#FF0000"; // Red
    }
};

//  Add legend bottom right corner
let legend = L.control({
    position:"bottomright"
});

//  Create Legend & return title
legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h3>Depth</h3>";
    return div;
  };

// Define the color categories and labels
let legendColors = [
    "#00FF00",  "greenyellow",  "yellow", "orange",  "orangered", "#FF0000" 
  ];

//  Create legend labels
let labels = ["<10","10 to 30", "30 to 50", "50 to 70", "70 to 90", ">90"]

//  Create legend control
// let legendcontrol = L.control({position: "bottomright"});

//  add features
legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend");
  div.style.backgroundColor = "white";
  div.style.border = "1px solid #ccc";
  div.innerHTML += "<h3>Depth</h3>";

//  Loop through categories
for (let i = 0; i < legendColors.length; i++) {
    div.innerHTML += `<div style="display: flex; align-items: center;">
    <div style="width: 20px; height: 20px; background-color:${legendColors[i]}; margin-right: 5px;"></div>
    <span>${labels[i]}</span>
  </div>`;
}
return div;
};

legend.addTo(myMap);