// Function for bar, gauge and bubble plotting
function getPlot(id) {
    d3.json("samples.json").then((data)=> {
        console.log(data)
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        // Filter by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
        // Top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        // Only top 10 otu ids, reversing 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        // Otu id's to desired form
        var OTU_id = OTU_top.map(d => "OTU " + d)
        console.log(`OTU IDS: ${OTU_id}`)
        // Top 10 labels
        var labels = samples.otu_labels.slice(0, 10);
        console.log(`Sample Values: ${samplevalues}`)
        console.log(`Id Values: ${OTU_top}`)
        // Trace variable
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
        // Data variable
        var data = [trace];
        // Layout variable
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        //  Bar
        Plotly.newPlot("bar", data, layout);
        console.log(`ID: ${samples.otu_ids}`)
        // Bubble
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
        // Bubble layout
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
        // Data variable
        var data1 = [trace1];
        // Bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
        // Gauge
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",       
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 1], color: "white" },
                    { range: [1, 2], color: "lightgrey" },
                    { range: [2, 3], color: "grey" },
                    { range: [3, 4], color: "#fcffa4" },
                    { range: [4, 5], color: "yellow" },
                    { range: [5, 6], color: "rgb(255,210,0)" },
                    { range: [6, 7], color: "rgb(161,217,155)" },
                    { range: [7, 8], color: "rgb(116,196,118)" },
                    { range: [8, 9], color: "green" },
                  ]}       
          }
        ];
        var layout_g = { 
            width: 800, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  
function getInfo(id) {
    d3.json("samples.json").then((data)=> {  
        // Metadata info for panel
        var metadata = data.metadata;
        console.log(metadata)
        // Filter meta data by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // Select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        // Empty info panel each time before new info
        demographicInfo.html("");
        // Grab data for id and append to panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}
// Change event function
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}
// Initial data function
function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=> {
        console.log(data)
        // Data for dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        // Display data and plot
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}
init();