import { useRef, useState } from "react";
import * as d3 from "d3";

const width = 928;
const height = 500;

const data = [
  { name: "Christians", value: 2_173_180_000 },
  { name: "Muslims", value: 1_598_510_000 },
  { name: "None", value: 1_126_500_000 },
  { name: "Hindus", value: 1_033_080_000 },
  { name: "Buddhists", value: 487_540_000 },
  { name: "Folk Religionists", value: 405_120_000 },
  { name: "Other Religions", value: 58_110_000 },
  { name: "Jews", value: 13_850_000 },
];

const PieChart = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [tooltipTop, setTooltipTop] = useState(0);
  const [tooltipData, setTooltipData] = useState(data[0]);
  const chartRef = useRef();

  // Major Religious Groups	Percentage of the global population
  // Specify the chart’s dimensions.

  // Calculate the total value
  const totalValue = data.reduce((sum, religion) => sum + religion.value, 0);

  // Calculate the percentage for each religion
  const percentageData = data.map((religion) =>
    ((religion.value / totalValue) * 100).toFixed(1),
  );

  // Create the color scale
  // should be colors that can go with white text
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

  const labelRadius = arc.outerRadius()() * 0.75;
  const tooltipRadius = arc.outerRadius()() * 1;

  // A separate arc generator for labels.
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  const arcTooltip = d3
    .arc()
    .innerRadius(tooltipRadius)
    .outerRadius(tooltipRadius);

  const arcs = pie(data);

  return (
    <div className="container">
      <svg
        ref={chartRef}
        width={width}
        height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        style={{
          width: "100%",
          height: "auto",
          font: "16px sans-serif",
          position: "relative",
        }}
      >
        {arcs.map((d, i) => (
          <g
            key={d.data.name}
            stroke="white"
            onMouseOver={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onMouseMove={() => {
              setTooltipData(data[i]);
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
              {percentageData[i] > 5 ? `${percentageData[i]}%` : ""}
            </text>
            <g
              className={`tooltip${tooltipVisible ? " visible" : " "}`}
              // style={{
              //   right: "80px",
              //   top: "80px",
              // }}
              x={arcTooltip.centroid(d)[0]}
              y={arcTooltip.centroid(d)[1]}
            >
              <span style={{ color: color(tooltipData.name) }}>
                {tooltipData.name}
              </span>
              <br />
              <span>{tooltipData.value.toLocaleString()}</span>
            </g>
          </g>
        ))}

        <g transform={`translate(${-width + 500}, ${-height + 300})`}>
          {data.map((d, i) => (
            <g key={d.name} transform={`translate(0,${i * 20})`}>
              <rect rx={3} ry={3} width={20} height={15} fill={color(d.name)} />
              <text dx={25} alignmentBaseline="hanging">
                {d.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default PieChart;
