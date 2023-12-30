import { useEffect, useRef } from "react";
import * as d3 from "d3";

import "./styles.css";

const Chart = () => {
	const chartRef = useRef();
	const data = [130, 200, 170, 140, 130, 250, 160];

	useEffect(() => {
		// D3.js code for creating a bar chart
		const svgHeight = 300;
		const svgWidth = 450;
		const barWidth = 60;

		const svg = d3
			.select(chartRef.current)
			.attr("width", svgWidth)
			.attr("height", svgHeight);

		svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("width", barWidth)
			.attr("height", (barHeight, i) => barHeight)
			.attr("fill", "skyblue")
			.attr("x", (_, i) => i * (barWidth + 5))
			.attr("y", (barHeight) => svgHeight - barHeight);
	}, []);

	return <svg ref={chartRef}></svg>;
};

export default Chart;
