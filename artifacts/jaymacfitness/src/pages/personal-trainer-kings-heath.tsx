import AreaLandingPage, { type AreaData } from "../components/AreaLandingPage";
import areas from "../data/areas.json";

export default function PersonalTrainerKingsHeath() {
  return <AreaLandingPage area={areas["kings-heath"] as AreaData} />;
}
