import AreaLandingPage, { type AreaData } from "../components/AreaLandingPage";
import areas from "../data/areas.json";

export default function PersonalTrainerEdgbaston() {
  return <AreaLandingPage area={areas["edgbaston"] as AreaData} />;
}
