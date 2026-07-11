import AreaLandingPage, { type AreaData } from "../components/AreaLandingPage";
import areas from "../data/areas.json";

export default function PersonalTrainerSellyOak() {
  return <AreaLandingPage area={areas["selly-oak"] as AreaData} />;
}
