import { useMemo, useState } from "react";
import * as d3 from "d3";

const PieChart = ({ width, height, data }) => {
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [tooltipData, setTooltipData] = useState({
		...data[0],
		x: 0,
		y: 0,
	});

	// Calculate the total value
	const totalValue = data.reduce((sum, religion) => sum + religion.value, 0);

	// Calculate the percentage for each religion and format the result
	let percentageData = {};
	data.forEach((religion) => {
		percentageData[religion.name] = (
			(religion.value / totalValue) *
			100
		).toFixed(1);
	});

	// Create the color scale
	const color = d3
		.scaleOrdinal(d3.schemeTableau10)
		.domain(data.map((d) => d.name));

	// Create the pie layout and arc generator.
	const pie = d3
		.pie()
		.sort(null)
		.value((d) => d.value);

	const arc = d3
		.arc()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1);

	// A separate arc generator for labels.
	const labelRadius = arc.outerRadius()() * 0.75;
	const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

	const arcs = pie(data);

	return (
		<div className="container">
			<svg
				width={width}
				height={height}
				viewBox={`${-width / 2 + 100} ${
					-height / 2
				} ${width} ${height}`}
				className="viz"
			>
				{arcs.map((d, i) => (
					<g
						key={d.data.name}
						stroke="white"
						onMouseOver={() => setTooltipVisible(true)}
						onMouseLeave={() => setTooltipVisible(false)}
						onMouseMove={() => {
							setTooltipData({
								...data[i],
								x: arcLabel.centroid(d)[0],
								y: arcLabel.centroid(d)[1],
							});
						}}
					>
						<path d={arc(d)} fill={color(data[i].name)} />
						<text
							x={arcLabel.centroid(d)[0]}
							y={arcLabel.centroid(d)[1]}
							textAnchor="middle"
							stroke="none"
							fontSize={20}
							strokeWidth={0}
							fill="white"
						>
							{percentageData[d.data.name] > 5
								? `${percentageData[d.data.name]}%`
								: ""}
						</text>
					</g>
				))}

				{/* Legend */}
				<g>
					{data.map((d, i) => {
						const x = width / 2 - 70;
						const y = -height / 2 + i * 20 + 20;

						return (
							<g key={d.name}>
								<rect
									x={x}
									y={y}
									width={20}
									height={15}
									fill={color(d.name)}
								/>
								<text
									x={x}
									y={y}
									dx={25}
									alignmentBaseline="hanging"
								>
									{d.name}
								</text>
							</g>
						);
					})}
				</g>

				{/* Tooltip */}
				<g
					onMouseOver={() => setTooltipVisible(true)}
					onMouseLeave={() => setTooltipVisible(false)}
					className={`tooltip ${tooltipVisible ? "visible" : ""}`}
				>
					<rect
						width={200}
						height={60}
						x={tooltipData.x - 10}
						y={tooltipData.y + 10}
						stroke="#cccccc"
						strokeWidth="1"
						fill="#ffffff"
					></rect>
					<g>
						<text
							textAnchor="start"
							x={tooltipData.x}
							y={tooltipData.y + 35}
							fontSize={16}
						>
							{tooltipData.name}
						</text>
					</g>
					<g>
						<text
							textAnchor="start"
							x={tooltipData.x}
							y={tooltipData.y + 55}
							fontSize={17}
							fontWeight="bold"
						>
							{tooltipData.value.toLocaleString()}
							{` (${percentageData[tooltipData.name]}%)`}
						</text>
					</g>
				</g>
			</svg>
		</div>
	);
};

export default PieChart;
