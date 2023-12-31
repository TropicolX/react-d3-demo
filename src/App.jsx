import { useEffect } from "react";
import * as d3 from "d3";

function App() {
  useEffect(() => {
    // Fetch JSON data using d3.json
    d3.json(
      "https://js.devexpress.com/React/Demos/WidgetsGallery/JSDemos/data/simpleJSON.json",
    ).then((data) => {
      // Select the table
      const table = d3.select("#salesTable");

      // Add table headers
      table
        .append("thead")
        .append("tr")
        .selectAll("th")
        .data(Object.keys(data[0])) // Assuming all objects have the same keys
        .join("th")
        .text((d) => d);

      // Add table rows with data
      table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr")
        .selectAll("td")
        .data((d) => Object.values(d))
        .join("td")
        .text((d) => d);
    });
  }, []);

  return <table id="salesTable"></table>;
}

export default App;
