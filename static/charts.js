function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
            });
            // Use the first sample from the list to build the initial plots
            var firstSample = sampleNames[0];
            buildCharts(firstSample);
            buildMetadata(firstSample);
    });
}
// Initialize the dashboard
init();
  
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}
  
// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        PANEL.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
        // 3. Create a variable that holds the samples array. 
        let samples = data.samples;
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        let desired_sample = samples.filter(data => data.id == sample);
        //  5. Create a variable that holds the first sample in the array.
        let first_sample = desired_sample[0];
        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        let otu_ids = first_sample.otu_ids;
        let otu_labels = first_sample.otu_labels;
        let sample_values = first_sample.sample_values;
        // 7. Create the yticks for the bar chart.
        // Hint: Get the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last.
        var yticks = otu_ids.map((data) => `OTU ${data}`).slice(0, 10).reverse();
        // 8. Create the trace for the bar chart. 
        var barData = [
            {
                type: "bar",
                orientation: "h",
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels,
            }
        ];
        // 9. Create the layout for the bar chart. 
        var layout = {
            title: "Top 10 Bacteria Cultures Found",
        };
        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", barData, layout);
        
        // DELIVERABLE 2
        // 1. Create the trace for the bubble chart.
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                hover: otu_labels,
                marker: {
                    color: otu_ids,
                    size: sample_values,
                    colorscale: 'Earth'
                },
            }
        ];

        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: "Bacteria Cultures per Sample",
            xaxis: {
                title: {
                  text: 'OTU ID'
                }
              },
        };
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
        // DELIVERABLE 3
    });
}
  