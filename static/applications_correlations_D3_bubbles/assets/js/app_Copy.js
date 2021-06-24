// Data Journalism - D3

// Code for Chart is Wrapped Inside a Function That Automatically Resizes the Chart
function makeResponsive() {

  
  //########################  SVG Setup ###################################//
  
      // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
      var svgArea = d3.select("body").select("svg");
      // Clear SVG if Not Empty
      if (!svgArea.empty()) {
        svgArea.remove();
      }
      // Setup Chart Parameters/Dimensions
      var svgWidth = 980;
      var svgHeight = 600;
      // Set SVG Margins
      var margin = {
        top: 20,
        right: 40,
        bottom: 90,
        left: 125
      };
      // Define Dimensions of the Chart Area
      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;
      // Create an SVG Element/Wrapper - Select Body, Append SVG Area & Set the Dimensions
      var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        // .attr("clip-path", "acsData(#clip)");
      // Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
      var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);





      


        
  
  
  
  
  // #################### Define Function ###############//
      // Function for Updating xScale Upon Click on X Axis Label
      function xScale(acsData, chosenXAxis) {
        // Create Scale Functions for the Chart (chosenXAxis)
        var xLinearScale = d3.scaleLinear()
          .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
            d3.max(acsData, d => d[chosenXAxis]) * 1.2
          ])
          .range([0, width]);
        return xLinearScale;
      }
    
      // Function for Updating yScale Upon Click on Y Axis Label
      function yScale(acsData, chosenYAxis) {
        // Create Scale Functions for the Chart (chosenYAxis)
        var yLinearScale = d3.scaleLinear()
          .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
            d3.max(acsData, d => d[chosenYAxis]) * 1.2
          ])
          .range([height, 0]);
        return yLinearScale;
      }
    
      // Function for Updating xAxis Upon Click on X Axis Label
      function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
        return xAxis;
      }
    
      // Function for Updating yAxis Upon Click on Y Axis Label
      function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
          .duration(1000)
          .call(leftAxis);
        return yAxis;
      }
    
      // Function for Updating Circles Group with a Transition to New Circles
      function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
        circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d[chosenXAxis]))
          .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
      }
    
      // Function for Updating Text Group with a Transition to New Text, this is similar to Erin's function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis)
      function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
        textGroup.transition()
          .duration(1000)
          .attr("x", d => newXScale(d[chosenXAxis]))
          .attr("y", d => newYScale(d[chosenYAxis]))
          .attr("text-anchor", "middle");
    
        return textGroup;
      }
    
      // Function for Updating Circles Group with New Tooltip
      function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    
        if (chosenXAxis === "application_per_state") {
          var xLabel = "application_per_state";
        }
        else if (chosenXAxis === "Latitude") {
          var xLabel = "Latitude";
        }
        else {
          var xLabel = "Longitude";
        }
        if (chosenYAxis === "Population") {
          var yLabel = "Population";
        }
        else if (chosenYAxis === "Per_Capita_Income") {
          var yLabel = "Per_Capita_Income";
        }
        else {
          var yLabel = "Poverty_Rate";
        }
    
        // Initialize Tool Tip
        var toolTip = d3.tip()
          .attr("class", "tooltip d3-tip")
          .offset([90, 90])
          .html(function(d) {
            return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
          });
        // Create Circles Tooltip in the Chart
        circlesGroup.call(toolTip);
        // Create Event Listeners to Display and Hide the Circles Tooltip
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout Event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });
        // Create Text Tooltip in the Chart
        textGroup.call(toolTip);
        // Create Event Listeners to Display and Hide the Text Tooltip
        textGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout Event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });
        return circlesGroup;
      }
    
      // // recover the new scale
      // var newX = d3.event.transform.rescaleX(x);
      // var newY = d3.event.transform.rescaleY(y);
  
  
  
    
  // #################### BRING in Data and ADD Structure ###############//
      // Initial Params
      var chosenXAxis = "application_per_state";
      var chosenYAxis = "Population";
  
      // Import Data from the data.csv File & Execute Everything Below
      d3.csv("assets/data/liang.csv")
        .then(function(acsData) {
    
        // Format/Parse the Data (Cast as Numbers)
        acsData.forEach(function(data) {
          data.Population = +data.Population;
          data.Per_Capita_Income = +data.Per_Capita_Income;
          data.Poverty_Rate = +data.Poverty_Rate;
          data.application_per_state = +data.application_per_state;
          data.Latitude = +data.Latitude;
          data.Longitude = +data.Longitude;
        });
    
        // Create xLinearScale & yLinearScale Functions for the Chart
        var xLinearScale = xScale(acsData, chosenXAxis);
        var yLinearScale = yScale(acsData, chosenYAxis);
    
        // Create Axis Functions for the Chart
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // Append xAxis to the Chart
        var xAxis = chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
    
        // Append yAxis to the Chart
        var yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          .call(leftAxis);
    
        // Create & Append Initial Circles
        var circlesGroup = chartGroup.selectAll(".stateCircle")
          .data(acsData)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d[chosenXAxis]))
          .attr("cy", d => yLinearScale(d[chosenYAxis]))
          .attr("class", "stateCircle")
          .attr("r", 15)
          .attr("opacity", ".75");
    
        // Append Text to Circles
        var textGroup = chartGroup.selectAll(".stateText")
          .data(acsData)
          .enter()
          .append("text")
          .attr("x", d => xLinearScale(d[chosenXAxis]))
          .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
          .text(d => (d.abbr))
          .attr("class", "stateText")
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("fill", "white");
    
        // Create Group for 3 xAxis Labels
        var xLabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
        // Append xAxis
        var application_per_stateLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "application_per_state") // Value to Grab for Event Listener
          .classed("active", true)
          .text("application_per_state");
    
        var LatitudeLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "Latitude") // Value to Grab for Event Listener
          .classed("inactive", true)
          .text("Latitude");
    
        var LongitudeLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "Longitude") // Value to Grab for Event Listener
          .classed("inactive", true)
          .text("Longitude");
    
        // Create Group for 3 yAxis Labels
        var yLabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(-25, ${height / 2})`);
        // Append yAxis
        var PopulationLabel = yLabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", 0)
          .attr("value", "Population")
          .attr("dy", "1em")
          .classed("axis-text", true)
          .classed("active", true)
          .text("Population");
    
        var Per_Capita_IncomeLabel = yLabelsGroup.append("text") 
          .attr("transform", "rotate(-90)")
          .attr("y", -80)
          .attr("x", 0)
          .attr("value", "Per_Capita_Income")
          .attr("dy", "1em")
          .classed("axis-text", true)
          .classed("inactive", true)
          .text("Per_Capita_Income");
    
        var Poverty_RateLabel = yLabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -100)
          .attr("x", 0)
          .attr("value", "Poverty_Rate")
          .attr("dy", "1em")
          .classed("axis-text", true)
          .classed("inactive", true)
          .text("Poverty_Rate");
    
        // updateToolTip Function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
    
  
  
  
  // #################### ADD updates upon clicking axis text  ###############//
        // xAxis Labels Event Listener
        xLabelsGroup.selectAll("text")
          .on("click", function() {
            // Get Value of Selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
              // Replaces chosenXAxis with Value
              chosenXAxis = value;
              // Updates xScale for New Data
              xLinearScale = xScale(acsData, chosenXAxis);
              // Updates xAxis with Transition
              xAxis = renderXAxes(xLinearScale, xAxis);
              // Updates Circles with New Values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
              // Updates Text with New Values
              textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
              // Updates Tooltips with New Information
              circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
              // Changes Classes to Change Bold Text
              if (chosenXAxis === "application_per_state") {
                application_per_stateLabel
                  .classed("active", true)
                  .classed("inactive", false);
                LatitudeLabel
                  .classed("active", false)
                  .classed("inactive", true);
                LongitudeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else if (chosenXAxis === "Latitude") {
                application_per_stateLabel
                  .classed("active", false)
                  .classed("inactive", true);
                LatitudeLabel
                  .classed("active", true)
                  .classed("inactive", false);
                LongitudeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else {
                application_per_stateLabel
                  .classed("active", false)
                  .classed("inactive", true);
                LatitudeLabel
                  .classed("active", false)
                  .classed("inactive", true);
                LongitudeLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
            }
          });
        
        // yAxis Labels Event Listener
        yLabelsGroup.selectAll("text")
          .on("click", function() {
            // Get Value of Selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
              // Replaces chosenYAxis with Value
              chosenYAxis = value;
              console.log(chosenYAxis);
              // Updates yScale for New Data
              yLinearScale = yScale(acsData, chosenYAxis);
              console.log(acsData);
              // Updates yAxis with Transition
              yAxis = renderYAxes(yLinearScale, yAxis);
              // Updates Circles with New Values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
              // Updates Text with New Values
              textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
              // Updates Tooltips with New Information
              circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
              // Changes Classes to Change Bold Text
              if (chosenYAxis === "Population") {
                PopulationLabel
                  .classed("active", true)
                  .classed("inactive", false);
                Per_Capita_IncomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
                Poverty_RateLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else if (chosenYAxis === "Per_Capita_Income") {
                PopulationLabel
                  .classed("active", false)
                  .classed("inactive", true);
                Per_Capita_IncomeLabel
                  .classed("active", true)
                  .classed("inactive", false);
                Poverty_RateLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else {
                PopulationLabel
                  .classed("active", false)
                  .classed("inactive", true);
                Per_Capita_IncomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
                Poverty_RateLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
            }
          });
      });
    }
  
// When Browser Loads, makeResponsive() is Called
makeResponsive();



// Add a clipPath: everything out of this area won't be drawn.
var clip = svg.append("defs").append("svg:clipPath")
.attr("id", "clip")
.append("svg:rect")
.attr("width", width )
.attr("height", height )
.attr("x", 0)
.attr("y", 0);

// Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
var zoom = d3.zoom()
.scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
.extent([[0, 0], [width, height]])
.on("zoom", makeResponsive);

// This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
svg.append("rect")
.attr("width", width)
.attr("height", height)
.style("fill", "none")
.style("pointer-events", "all")
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
.call(zoom);
// now the user can zoom and it will trigger the function called updateChart




  


// When Browser Window is Resized, makeResponsive() is Called
d3.select(window).on("resize", makeResponsive);