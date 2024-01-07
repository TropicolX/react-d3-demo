import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import Legend from "./Legend";

const WorldMap = ({ width, height, data }) => {
	const chartRef = useRef(null);
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [tooltipData, setTooltipData] = useState(null);
	const [mapStyle, setMapStyle] = useState(null);

	const worldPopulation = data.worldPopulation;
	const topography = data.topography;

	// Map and projection
	const path = d3.geoPath();
	const projection = d3
		.geoMercator()
		.scale(120)
		.center([0, 30])
		.translate([width / 2, height / 2]);

	// Color scale
	const colorScale = d3
		.scaleThreshold()
		.domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
		.range(d3.schemeBlues[7]);

	const zoom = d3
		.zoom()
		.scaleExtent([1, 8])
		.on("zoom", (event) => {
			const { transform } = event;
			setMapStyle({
				transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
				strokeWidth: 1 / transform.k,
			});
		});

	function reset() {
		const svg = d3.select(chartRef.current);
		svg.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity,
				d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
			);
	}

	useEffect(() => {
		const svg = d3.select(chartRef.current);
		svg.call(zoom);
	}, [zoom]);

	return (
		<div className="container">
			<svg
				ref={chartRef}
				className="viz"
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				onClick={() => reset()}
			>
				<g className="topography" style={mapStyle}>
					{topography.features.map((d) => (
						<path
							key={d.id}
							d={path.projection(projection)(d)}
							fill={colorScale(worldPopulation[d.id] || 0)}
							stroke="#FFFFFF"
							strokeWidth={0.3}
							onMouseEnter={() => {
								setTooltipVisible(true);
							}}
							onMouseLeave={() => {
								setTooltipVisible(false);
							}}
							onMouseMove={(event) => {
								const population = (
									worldPopulation[d.id] || "N/A"
								).toLocaleString();
								setTooltipData({
									name: d.properties.name,
									population,
									left: event.clientX - 70,
									top: event.clientY - 220,
								});
							}}
						/>
					))}
				</g>
				<g className="legend" transform="translate(10,10)">
					<Legend
						color={colorScale}
						width={600}
						tickFormat={d3.format("~s")}
					/>
				</g>
			</svg>
			{tooltipData && (
				<div
					className={`tooltip ${tooltipVisible ? "visible" : ""}`}
					style={{
						left: tooltipData.left,
						top: tooltipData.top,
					}}
				>
					{tooltipData.name}
					<br />
					{tooltipData.population}
				</div>
			)}
		</div>
	);
};

export default WorldMap;
