
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 8
});

  // Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// let crime_url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";


// let Applications = [];
// let lat = [];
// let lng = [];


d3.csv("static/js/ca_cities_applications_coords_cleaned.csv").then(
    function(data) {
        // let max = 350740;
        // let avr = 1;
        console.log(data);
        let arr = [];
        data.forEach(elt => {
            // make a heatmap ...350740
            arr.push([elt.lat, elt.lng, elt.Applications/2]);
        });
        console.log(arr);
        L.heatLayer(arr, {
            radius: 20,
            // blur: 10, 
            max: 250,
            gradient : {0.5: 'blue', 0.55: 'orange', 1: 'red'}
        }).addTo(myMap);

        // var legend = L.control({ position: "bottomright" });
        // legend.onAdd = function () {
        //     var div = L.DomUtil.create("div", "info legend");
        //     var limits = geojson.ption.limits;
        //     var colors = geojson.options.colors;
        //     var labels = [];

        //     var legendInfo = "";
        //     div.innerHTML = legendInfo;

        //     limits.forEach(function (liit, index) {
        //         labels.push("*);
        //     });
        //     div.innerHTML += "ul" + labels.join("") + "</ul>";
        //     return div;
        // };
        // legend.addTo(myMap)

    }
)



// CA City	Applications	lat	lng 
