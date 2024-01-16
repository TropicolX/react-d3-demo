import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import Legend from "./Legend";
import useChartDimensions from "../hooks/useChartDimensions";

const WorldMap = ({ height, data }) => {
  const worldPopulation = data.worldPopulation;
  const topography = data.topography;

  const [ref, dms] = useChartDimensions({});
  const width = dms.width;

  const chartRef = useRef(null);
  const [mapStyle, setMapStyle] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    name: "",
    population: "",
    x: 0,
    y: 0,
  });

  // Map and projection
  const path = d3.geoPath();
  const projection = d3
    .geoMercator()
    .scale(85)
    .center([0, 30])
    .translate([width / 2, height / 2]);

  const pathGenerator = path.projection(projection);

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
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2]),
      );
  }

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.call(zoom);
  }, [zoom]);

  return (
    <div
      ref={ref}
      style={{
        height,
      }}
      className="container"
    >
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
              d={pathGenerator(d)}
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

                // get x and y position relative to the chart
                const [x, y] = d3.pointer(event, chartRef.current);

                setTooltipData({
                  name: d.properties.name,
                  population,
                  left: x - 30,
                  top: y - 80,
                });
              }}
            />
          ))}
        </g>

        {/* Legend */}
        <g className="legend" transform="translate(10,10)">
          <Legend
            color={colorScale}
            width={height / 1.4}
            tickFormat={d3.format("~s")}
          />
        </g>
      </svg>

      {/* Tooltip */}
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
