import { useEffect, useState } from "react";
import * as d3 from "d3";

import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import WorldMap from "./components/WorldMap";

const pieChartData = [
  { name: "Christians", value: 2_173_180_000 },
  { name: "Muslims", value: 1_598_510_000 },
  { name: "None", value: 1_126_500_000 },
  { name: "Hindus", value: 1_033_080_000 },
  { name: "Buddhists", value: 487_540_000 },
  { name: "Folk Religionists", value: 405_120_000 },
  { name: "Other Religions", value: 58_110_000 },
  { name: "Jews", value: 13_850_000 },
];

const barChartData = [
  { country: "India", population: 1_417_173_173 },
  { country: "China", population: 1_412_175_000 },
  { country: "United States", population: 333_287_557 },
  { country: "Indonesia", population: 275_501_339 },
  { country: "Pakistan", population: 235_824_862 },
  { country: "Nigeria", population: 218_541_212 },
  { country: "Brazil", population: 215_313_498 },
  { country: "Bangladesh", population: 171_186_372 },
  { country: "Russia", population: 144_236_933 },
  { country: "Mexico", population: 127_504_125 },
  { country: "Japan", population: 125_124_989 },
  { country: "Ethiopia", population: 123_379_924 },
];

function App() {
  const [worldPopulation, setWorldPopulation] = useState(null);
  const [topography, setTopography] = useState(null);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      let populationData = {};
      await Promise.all([
        d3.json(
          "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world.geojson",
        ),
        d3.csv(
          "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world_population.csv",
          (d) => {
            populationData = {
              ...populationData,
              [d.code]: +d.population,
            };
          },
        ),
      ]).then((fetchedData) => {
        const topographyData = fetchedData[0];
        const barChartData = topographyData.features
          .map((d) => ({
            country: d.properties.name,
            population: populationData[d.id] || 0,
          }))
          .sort((a, b) => b.population - a.population)
          .slice(0, 12);
        setBarChartData(barChartData);
        setWorldPopulation(populationData);
        setTopography(topographyData);
      });

      setLoading(false);
    };

    getData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="wrapper">
        <h1>
          <span className="thin">World</span>
          <span className="bold">Population</span> Insights 2022
        </h1>
        <main className="main">
          <div className="grid">
            <div className="card stat-card">
              <h2>Total Population</h2>
              <span className="stat">7.95B</span>
            </div>
            <div className="card stat-card">
              <h2>Male Population</h2>
              <span className="stat">4B</span>
            </div>
            <div className="card stat-card">
              <h2>Female Population</h2>
              <span className="stat">3.95B</span>
            </div>
            <div className="card map-container">
              <h2>World Population by Country</h2>
              <WorldMap
                // width={550}
                height={450}
                data={{ worldPopulation, topography }}
              />
            </div>
            <div className="card pie-chart-container">
              <h2>World Population by Religion</h2>
              <PieChart
                // width={650}
                height={450}
                data={pieChartData}
              />
            </div>
            <div className="card bar-chart-container">
              <h2>Top Countries by Population (in millions)</h2>
              <BarChart
                // width={1248}
                height={500}
                data={barChartData}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
