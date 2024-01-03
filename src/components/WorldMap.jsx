import { useEffect, useRef } from "react";
import * as d3 from "d3";

import Legend from "../utils/Legend";

const WorldMap = () => {
  const chartRef = useRef();

  useEffect(() => {
    // Specify the chart’s dimensions.
    const width = 800;
    const height = 600;

    // Map and projection
    const path = d3.geoPath();
    const projection = d3
      .geoMercator()
      .scale(100)
      .center([0, 30])
      .translate([width / 2, height / 2]);

    // Data and color scale
    let data = new Map();
    const colorScale = d3
      .scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);

    // Load external data and boot
    Promise.all([
      d3.json(
        "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world.geojson"
      ),
      d3.csv(
        "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world_population.csv",
        (d) => {
          data.set(d.code, +d.population);
        }
      ),
    ]).then((loadData) => {
      let topo = loadData[0];
      // Create the SVG container.
      const svg = d3
        .select(chartRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

      // Append the legend.
      svg.append("g")
        .attr("transform", "translate(20,0)")
        .append(() =>
          Legend(colorScale, {
            title: "World population",
            width: 500,
            tickFormat: d3.format(",.0f"),
          })
        );

      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", path.projection(projection))
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        });
    });
  }, []);

  return <svg ref={chartRef}></svg>;
};

export default WorldMap;

