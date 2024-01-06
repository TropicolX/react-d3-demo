import { useEffect } from "react";
import * as d3 from "d3";

const marginTop = 30;
const marginBottom = 30;
const marginLeft = 100;
const marginRight = 100;
const oneMillion = 1_000_000;

const BarChart = ({ width, height, data }) => {
	// Sort data by population in descending order
	const sortedData = data.sort((a, b) => b.population - a.population);

	// Create the horizontal scale and its axis generator.
	const xScale = d3
		.scaleBand()
		.domain(sortedData.map((d) => d.country))
		.range([marginLeft, width - marginRight])
		.padding(0.1);

	const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

	// Create the vertical scale and its axis generator.
	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(sortedData, (d) => d.population / oneMillion)])
		.nice()
		.range([height - marginBottom, marginTop]);

	const yAxis = d3.axisLeft(yScale);

	useEffect(() => {
		d3.select(".x-axis").call(xAxis);
		d3.select(".y-axis").call(yAxis);
	}, [xAxis, yAxis]);

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			height={height}
			style={{
				maxWidth: "100%",
				height: "auto",
			}}
		>
			<g className="bars">
				{sortedData.map((d) => (
					<rect
						key={d.country}
						x={xScale(d.country)}
						y={yScale(d.population / oneMillion)}
						height={yScale(0) - yScale(d.population / oneMillion)}
						width={xScale.bandwidth()}
						fill="#4e79a7"
					/>
				))}
			</g>
			<g className="labels">
				{sortedData.map((d) => (
					<text
						key={d.country}
						x={xScale(d.country) + xScale.bandwidth() / 2}
						y={yScale(d.population / oneMillion) - 5}
						textAnchor="middle"
						fontSize={12}
					>
						{Number(
							(d.population / oneMillion).toFixed(1)
						).toLocaleString()}
					</text>
				))}
			</g>
			<g
				className="x-axis"
				transform={`translate(0,${height - marginBottom})`}
			></g>
			<g className="y-axis" transform={`translate(${marginLeft},0)`}></g>
		</svg>
	);
};

export default BarChart;
