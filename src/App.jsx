import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import WorldMap from "./components/WorldMap";
import GraphPieChart from "./components/GraphPieChart";

function App() {
  const width = 928;
  const height = Math.min(width, 500);
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

  return <PieChart />;
}

export default App;
