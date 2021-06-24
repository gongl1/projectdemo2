d3.json("https://uspto-gong.herokuapp.com/api/v1.0/uspc_class_daysandrate_all").then(data => console.log(data));


function buildMetadata(newSample) {
    d3.json(`https://uspto-gong.herokuapp.com/api/v1.0/uspc_class_daysandrate_all`).then((datatiger) => {
        let uspc_class = unpack(datatiger, 0);
        let application_number_all = unpack(datatiger, 1);
        let application_number_patented = unpack(datatiger, 2);
        let patented_rate = unpack(datatiger, 3);
        let patented_cases_per_class = unpack(datatiger, 4);
        let average_years = unpack(datatiger, 5);
        
        // 15-interactive visualization dashboard-Day2- Act04unpack !!!!!!!!!
        console.log(uspc_class);
        console.log(application_number_all);
        console.log(application_number_patented);
        console.log(patented_rate);
        console.log(patented_cases_per_class);
        console.log(average_years);


        let uspc_class_result_array = datatiger.filter(sampleObj => sampleObj[0] == newSample);
        console.log(uspc_class_result_array);
        // Use d3 to select the panel with id of `#sample-metadata`, this is the panel under Demographic Info
        let PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair in result above to the panel
        // Inside the loop, use d3 to append new tags for each key-value in the metadata.
        // Below addes info to the Demographc Info Panel 

        headerNames = ["uspc_class", "application_number_all", "application_number_patented", "patented_rate %", "patented_cases_per_class", "average_years"];
        headerNames.forEach((header, idx)=>{
        PANEL.append("h6").text(`${header}: ${uspc_class_result_array[0][idx]}`);
        })
            
    });
}

// buildMetadata(074);


function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}

d3.json(`https://uspto-gong.herokuapp.com/api/v1.0/uspc_class_daysandrate_all`).then((datatiger) => {
    let uspc_class = unpack(datatiger, 0);
    let application_number_all = unpack(datatiger, 1);
    let application_number_patented = unpack(datatiger, 2);
    let patented_rate = unpack(datatiger, 3);
    let patented_cases_per_class = unpack(datatiger, 4);
    let average_years = unpack(datatiger, 5);

    // 15-interactive visualization dashboard-Day2- Act04unpack !!!!!!!!!
    console.log(uspc_class);
    console.log(application_number_all);
    console.log(application_number_patented);
    console.log(patented_rate);
    console.log(patented_cases_per_class);
    console.log(average_years);

    // build a 3D bubble chart
    var trace2 = {
        x: application_number_all, y: patented_rate, z: average_years,
        text: uspc_class,
        mode: 'markers',
        marker: {
            // color: 'rgb(0,105,148)',
            color: patented_rate,
            size: 12,
            symbol: 'circle',
            showscale: true,
            line: {
                color: 'rgb(204, 204, 204)',
                width: 1
            },
            opacity: 0.8
        },
        type: 'scatter3d'
    };

    var data = [trace2];

    var layout = {
        // title: "3D-Patented Rate and Duration by USPC Class",
        title: {text: "3D-Patented Rate and Duration by USPC Class", font: {size: 18, color: "black"}},
        // xaxis: {title: {text: "total applications"}},
        // yaxis: {title: {text: "patented rate %"}},
        // zaxis: {title: {text: "average years to obtain patent"}},
        scene: {
            xaxis: {
                title: 'X: total applications',
                backgroundcolor: "rgb(200, 200, 230)",
                gridcolor: "rgb(255, 255, 255)",
                showbackground: true,
                zerolinecolor: "rgb(255, 255, 255)",
            },
            yaxis: {
                title: 'Y: patented rate %',
                backgroundcolor: "rgb(230, 200, 230)",
                gridcolor: "rgb(255, 255, 255)",
                showbackground: true,
                zerolinecolor: "rgb(255, 255, 255)"
            },
            zaxis: {
                title: 'Z: average years',
                backgroundcolor: "rgb(230, 230, 200)",
                gridcolor: "rgb(255, 255, 255)",
                showbackground: true,
                zerolinecolor: "rgb(255, 255, 255)"
            },
            },
        margin: {
            l: 20,
            r: 20,
            b: 10,
            t: 25
        }
    };

Plotly.newPlot('bubble', data, layout);
});





// d3.json(`http://127.0.0.1:5000/api/v1.0/uspc_class_daysandrate_all`).then((datatiger) => {
//     let uspc_class = unpack(datatiger, 0);
//     let application_number_all = unpack(datatiger, 1);
//     let application_number_patented = unpack(datatiger, 2);
//     let patented_rate = unpack(datatiger, 3);
//     let patented_cases_per_class = unpack(datatiger, 4);
//     let average_years = unpack(datatiger, 5);

//     // 15-interactive visualization dashboard-Day2- Act04unpack !!!!!!!!!
//     console.log(uspc_class);
//     console.log(application_number_all);
//     console.log(application_number_patented);
//     console.log(patented_rate);
//     console.log(patented_cases_per_class);
//     console.log(average_years);

//     // build a 3D bubble chart
//     import plotly.graph_objects as go

//     import pandas as pd
    
//     fig = px.scatter_3d(df, x='year', y='continent', z='pop', size='gdpPercap', color='lifeExp',
//                         hover_data=['country'])
//     fig.update_layout(scene_zaxis_type="log")
//     fig.show()

// Plotly.newPlot('bubbletwo', data, layout);
// });









// build a table 
// var headerNames = ["uspc_class", "application_number_all", "application_number_patented", "patented_rate", "patented_cases_per_class", "average_years"];
d3.json("https://uspto-gong.herokuapp.com/api/v1.0/uspc_class_daysandrate_all").then(buildTable)

function buildTable (rows) { 
    // this function returns each column when key i = 0, 1, 2, 3, 4, 5!!!!!!!!!!!!!!!!!!
    function unpack(rows, key) {
        return rows.map(function (row) { return row[key]; });
    }

   const headerNames = ["uspc_class", "application_number_all", "application_number_patented", "patented_rate %", "patented_cases_per_class", "average_years"];
//    const dataColumns = [uspc_class, application_number_all, application_number_patented, patented_rate, patented_cases_per_class, average_years];


    var cellValues = [];
    for (i = 0; i < headerNames.length; i++) {
        cellValue = unpack(rows, i);
        cellValues[i] = cellValue;
    }
    console.log(cellValue);
    var data = [{
        type: 'table',
        columnwidth: [250, 600, 1000, 900, 600, 500],
        columnorder: [0, 1, 2, 3, 4, 5],
        header: {
            values: headerNames,
            align: "center",
            line: { width: 1, color: 'rgb(50, 50, 50)' },
            fill: { color: ['rgb(230, 230, 200)'] },
            font: { family: "Arial", size: 12, color: "black" }
        },
        cells: {
            values: cellValues,
            align: ["center", "center"],
            line: { color: "black", width: 1 },
            fill: { color: ['rgba(228, 222, 249, 0.65)', 'rgb(235, 193, 238)', 'rgba(228, 222, 249, 0.65)'] },
            font: { family: "Arial", size: 9, color: ["black"] }
        }
    }]

    var layout = {
        // title: "Patented Rate and Duration by USPC Class"
        title: {text: "Patented Rate and Duration by USPC Class", font: {size: 18, color: "black"}},
    }

    Plotly.newPlot('bar', data, layout);
};





function init() {
    // Grab the #selDataset reference to the dropdown select element
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Codes below are adding options for line 25 in html, it will include all uspc_class, for example <option value="074">074</option> !!!
    d3.json("https://uspto-gong.herokuapp.com/api/v1.0/uspc_class_all").then((datatiger) => {
        let uspc_class_all = unpack(datatiger, 0);
        uspc_class_all.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        
        // Use the first sample from the list to build the initial plots which is 940, like default when openning the page
        let firstSample = uspc_class_all[60];
        console.log(uspc_class_all);
        // console.log(uspc_class_all.length);
        console.log(firstSample);
        // buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}




// newSample is uspc_class 
// make sure to use function optionChanged() in plots.js to refer to line 25 in html onchange="optionChanged(this.value). https://www.w3schools.com/jsref/event_onchange.asp
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    // buildCharts(newSample);
    buildMetadata(newSample);
}



// Initialize the dashboard
init();
