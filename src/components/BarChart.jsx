import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const data = [
      { day: "Day 1", sales: 4 },
      { day: "Day 2", sales: 12 },
      { day: "Day 3", sales: 20 },
      { day: "Day 4", sales: 7 },
      { day: "Day 5", sales: 5 },
      { day: "Day 6", sales: 6 },
      { day: "Day 7", sales: 8 },
      { day: "Day 8", sales: 12 },
      { day: "Day 9", sales: 14 },
      { day: "Day 10", sales: 9 },
    ];
    const marginTop = 30;
    const marginBottom = 30;
    const marginLeft = 40;
    const marginRight = 40;
    const height = 350;
    const width = 500;

    // Create the horizontal scale and its axis generator.
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);

    // Create the vertical scale.
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.sales)])
      .nice()
      .range([height - marginBottom, marginTop]);

    // Create the SVG container and call the zoom behavior.
    const svg = d3
      .select(chartRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

    // Append the bars.
    svg
      .append("g")
      .attr("class", "bars")
      .attr("fill", "skyblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.day))
      .attr("y", (d) => y(d.sales))
      .attr("height", (d) => y(0) - y(d.sales))
      .attr("width", x.bandwidth());

    // Append the axes.
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove());
  }, []);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;

// const BarChart = () => {
//   const chartRef = useRef();

//   useEffect(() => {
//     const data = [130, 200, 170, 140, 130, 250, 160];
//     const svgHeight = 300;
//     const svgWidth = 450;
//     const barWidth = 60;

//     const svg = d3
//       .select(chartRef.current)
//       .attr("width", svgWidth)
//       .attr("height", svgHeight);

//     svg
//       .selectAll("rect")
//       .data(data)
//       .join("rect")
//       .attr("width", barWidth)
//       .attr("height", (barHeight) => barHeight)
//       .attr("fill", "skyblue")
//       .attr("x", (_, i) => i * (barWidth + 5))
//       .attr("y", (barHeight) => svgHeight - barHeight);
//   }, []);

//   return <svg ref={chartRef}></svg>;
// };
