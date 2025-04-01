// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get metadata array
    let metadata = data.metadata;

    // find the metadata for the selected sample
    let result = metadata.find(obj => obj.id == sample);

    // select the panel and clear any existing info
    let panel = d3.select("#sample-metadata");
    panel.html("");

    // add each key-value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    let allSamples = data.samples;
    let result = allSamples.find(obj => obj.id === sample);

    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;
    let otu_labels = result.otu_labels;

    // Bar Chart
    let topTenOtuIds = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let topTenSampleValues = sample_values.slice(0, 10).reverse();
    let topTenLabels = otu_labels.slice(0, 10).reverse();

    let barData = [{
      x: topTenSampleValues,
      y: topTenOtuIds,
      text: topTenLabels,
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 100 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    let bubbleLayout = {
      title: "OTUs in Sample",
      xaxis: { title: "OTU ID" },
      margin: { t: 50 },
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log("We got the data:");
    console.log(data);

    // get sample names
    let sampleNames = data.names;

    // select the dropdown menu
    let selector = d3.select("#selDataset");

    // add each sample as an option
    sampleNames.forEach((id) => {
      selector.append("option").text(id).property("value", id);
    });

    // get the first sample and build charts
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
