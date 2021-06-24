var selected_att;
var selected_class;

d3.json("https://uspto-gong.herokuapp.com/api/v1.0/uspc_attorney_success_withnames/074").then(data => console.log(data));


function buildMetadata(newSample) {
    d3.json(`https://uspto-gong.herokuapp.com/api/v1.0/uspc_attorney_success_withnames/${newSample}`).then((datatiger) => {
        let uspc_class = unpack(datatiger, 0);
      
        // Use d3 to select the panel with id of `#sample-metadata`, this is the panel under Demographic Info
        let PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair in result above to the panel
        // Inside the loop, use d3 to append new tags for each key-value in the metadata.
        // Below addes info to the Demographc Info Panel 
        // Object.entries(result).forEach(([key, value]) => {
        //     PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        // });
        PANEL.append("h6").text(`Chart below shows top 100 attoneys for uspc_class: ${uspc_class[0]}`);
        PANEL.append("h6").text(`You are looking at attorney: ${selected_att}`);
        // BONUS: Build the Gauge Chart. result.wfreq pass to function buildGauge()
        // buildGauge(result.wfreq);
        // console.log(result.wfreq);
    });
}




function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}

function buildCharts(newSample) {
    d3.json(`https://uspto-gong.herokuapp.com/api/v1.0/uspc_attorney_success_withnames/${newSample}`).then((datatiger) => {
        if(selected_att){
            datatiger = datatiger.filter(sampleObj => sampleObj[5] == selected_att);
            console.log(datatiger)
        }

       

        const bubble = document.getElementById("bubble")
        bubble.innerHTML ="";

        let uspc_class = unpack(datatiger, 0);
        let atty_registration_number = unpack(datatiger, 1);
        let application_number_patented = unpack(datatiger, 2);
        let application_number_all = unpack(datatiger, 3);
        let success_rate = unpack(datatiger, 4);
        let atty_name_last = unpack(datatiger, 5);
        let atty_name_first = unpack(datatiger, 6);
        let atty_practice_category = unpack(datatiger, 7);
        
        // 15-interactive visualization dashboard-Day2- Act04unpack !!!!!!!!!
     

        let atty_name_combined = atty_name_last.map(function(e, i) {
           return `${e}_${atty_name_first[i]}`;
        });
        

        let atty_reg_app_combined = atty_registration_number.map(function(e, i) {
            return `RegisNo:${e}_appAll:${application_number_all[i]}`;
         });


        // Build a Bubble Chart
        let bubbleLayout = {
        title: {text: "Circle Size Represents Application Numbers", font: {color: "black"}},

        // margin: { t: 0 },
        hovermode: "closest",
        xaxis: {
            
            // title: {text: "Full Name", standoff: 80},
            tickangle: -45,
        },
        yaxis: {
            range: [0, 1.0],
            // title: {text: "Full Name", standoff: 80},
            title: "Success Rate byColor",
        },
        margin: { t: 24, b: -10 }
        };

        let bubbleData = [
        {
            x: atty_name_combined,
            // x: atty_name_last, 
            y: success_rate,
            text: atty_reg_app_combined, 
            // text: [{application_number_all}, {atty_registration_number}],
            mode: "markers",
            marker: {
            size: application_number_all,
            sizeref: 4,
            color: success_rate,
            colorscale: "YlOrRd",
            reversescale: true, 
            showscale: true,
            colorbar: {x: -.2, len: 1.5, title: "Success Rate"},
            }
        }
        ];
        // It corresponds to the bubble div in html 
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);



        // Build a Overlay Bar Chart
        let trace1 = {
            // x: atty_name_last.slice(0, 100).map(otuID => `Attorny_Last_Name: ${otuID}`),
            x: atty_name_last.slice(0, 100).map(otuID => `${otuID}`),
            y: application_number_all.slice(0, 100),
            text: atty_name_combined.slice(0, 100),
            type: "bar",
            yaxis: 'y',
            // orientation: "h",
            marker: {color: "black"},
            name: "Application Numbers",
        };
        
        let trace2 = {
            x: atty_name_last.slice(0, 100).map(otuID => `${otuID}`),
            y: success_rate.slice(0, 100),
            text: atty_name_combined.slice(0, 100),
            type: "bar",
            yaxis: 'y2',
            // orientation: "h",
            
            marker: {color: success_rate, colorscale: "YlOrRd", reversescale: true, showscale: true, opacity: 0.65, colorbar: {x: -.2, len: 1.5, title: "Success Rate"}},
            // marker: {color: "red"},
            // colorscale: "YlOrRd",
            // reversescale: true, 
            // showscale: true,
            name: "Success Rate",
        };
        
        let data = [trace1, trace2];
       
        let barLayout = {
            xaxis: {
                    title: "Last Name",
                    automargin: true,
                    tickangle: -45
                    },
            titlefont: { size: 30},
            yaxis: {
              title: 'Application Numbers', 
                // titlefont: {color: 'rgb(148, 103, 189)'},
                // tickfont: {color: 'rgb(148, 103, 189)'},
                // overlaying: 'y',
                // side: 'right'
             },
            yaxis2: {
               title: {text: 'Success Rate byColor', y:+.3},
               titlefont: {color: 'black'},
               tickfont: {color: 'black'},
               overlaying: 'y',
               side: 'right'
            },
            // paper_bgcolor: "white",
            // plot_bgcolor: '#fff5f5',
            barmode: 'overlay',
            title: `Top 100 Attorneys Filing Most Cases under ${newSample}`,
            showlegend: false,
        margin: { t: 50, l: 200 }
        };
        // It corresponds to the bar div in html
        Plotly.newPlot("bar", data, barLayout);


    });
}




function init() {
    // Grab the #selDataset reference to the dropdown select element
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Codes below are adding options for line 37 in html, it will include all uspc_class, for example <option value="074">074</option> !!!
    d3.json("https://uspto-gong.herokuapp.com/api/v1.0/uspc_class_all").then((datatiger) => {
        let uspc_class_all = unpack(datatiger, 0);
        uspc_class_all.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        
        // Use the 60th sample from the list to build the initial plots which is 074, like default when openning the page
        let firstSample = uspc_class_all[60];
      
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}



// set up the drop down values under attorney 
function buildAttlist(newSample) {
    let selector_att = d3.select("#selDataset_att");
    // Use the list of sample names to populate the select options
    // Codes below are adding options for line 41 in html, it will include attorneys, for example <option value="074">074</option> !!!
    d3.json(`https://uspto-gong.herokuapp.com/api/v1.0/uspc_attorney_success_withnames/${newSample}`).then((datatiger) => {
        let atty_name_last_all = unpack(datatiger, 5);
        selector_att.selectAll("*").remove();
        atty_name_last_all.forEach((sample) => {
        selector_att
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    });
}


// newSample is uspc_class 
// make sure to use function optionChanged() in plots.js to refer to line 25 in html onchange="optionChanged(this.value). https://www.w3schools.com/jsref/event_onchange.asp
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildAttlist(newSample);
    selected_class = newSample;
    // optionChanged_att(atty_name_last_specific);
}

// selected_class is acting like a bridge between two function since newSample in function below is not recognizing newSample in function above!!!!!!!!!

function optionChanged_att(lastname) {
    console.log("atty_name_last_specific", lastname)
    selected_att = lastname
    buildCharts(selected_class);
    buildMetadata(selected_class);
}




d3.json(`https://uspto-gong.herokuapp.com/api/v1.0/uspc_attorney_success_withnames/074`).then((datatiger) => {
        let atty_name_last_chosen_array = datatiger.filter(sampleObj => sampleObj[5] == "Oblon");
});

// Initialize the dashboard
init();

// buildCharts(074);