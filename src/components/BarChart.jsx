import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const chartRef = useRef();
  
  useEffect(() => {
    const data = [130, 200, 170, 140, 130, 250, 160];
    const svgHeight = 300;
    const svgWidth = 450;
    const barWidth = 60;

    const svg = d3
      .select(chartRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", barWidth)
      .attr("height", (barHeight) => barHeight)
      .attr("fill", "skyblue")
      .attr("x", (_, i) => i * (barWidth + 5))
      .attr("y", (barHeight) => svgHeight - barHeight);
  }, []);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;