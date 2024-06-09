// initialize a global variable array
var globalData = [];

// Build the metadata panel

//This code block fetches metadata from the provided URL and builds the metadata panel for the selected sample.
// It filters the metadata for the selected sample, clears any existing metadata, and appends new tags for 
//each key-value pair in the filtered metadata.

function buildMetadata(sample) {
  //d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // reference and assign the first item in the global data array
    data = globalData[0];

    // Extract the metadata field
    let metadata = data.metadata;
    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number
    let selectedMetadata = metadata.filter(obj => obj.id == sample)[0];
    console.log("Selected Metadata:", selectedMetadata);

    // Select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Append new tags for each key-value in the filtered metadata
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  //});
}

//This code block builds both bubble and bar charts for the selected sample.
// It fetches sample data, filters it for the selected sample, extracts necessary 
//data (otu_ids, otu_labels, sample_values), and then builds the bubble chart with appropriate 
//settings. It also builds a bar\ chart displaying the top 10 OTUs.

// Function to build both charts
function buildCharts(sample) {
  //d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // reference and assign the first item in the global data array
    data = globalData[0];
  
    // Get the samples field
    var samples = data.samples;
    console.log("Samples:", samples);

    // Filter the samples for the object with the desired sample number
    var selectedSample = samples.filter(obj => obj.id == sample)[0];
    console.log("Selected Sample:", selectedSample);

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;
    console.log("OTU IDs:", otu_ids);
    console.log("Sample Values:", sample_values);
    console.log("OTU Labels:", otu_labels);

    // Build a Bubble Chart
    var traceBubble = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    var dataBubble = [traceBubble];
    var layoutBubble = {
      title: 'OTU ID vs Sample Values',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };
    console.log("Bubble Chart Data:", dataBubble);
    Plotly.newPlot('bubble', dataBubble, layoutBubble);

    // Build a Bar Chart
    var traceBar = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };
    var dataBar = [traceBar];
    var layoutBar = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };
    console.log("Bar Chart Data:", dataBar);
    Plotly.newPlot('bar', dataBar, layoutBar);
  //});
}


// Function to run on page load

//This code block initializes the dashboard when the page loads. It fetches sample names,
//populates the dropdown menu with sample names, selects the first sample from the list, 
//and then builds charts and the metadata panel with the first sample.

function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    //add the data to a global variable array
    globalData.push(data);
  
    // Get the names field
    let names = data.names;
    //console.log("Sample Names:", names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];
    //console.log("First Sample:", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Function for event listener

//This code block is a function called whenever a new sample is selected

function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
