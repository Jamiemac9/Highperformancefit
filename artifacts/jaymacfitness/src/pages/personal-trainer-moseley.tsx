import AreaLandingPage, { type AreaData } from "../components/AreaLandingPage";
import areas from "../data/areas.json";

export default function PersonalTrainerMoseley() {
  return <AreaLandingPage area={areas["moseley"] as AreaData} />;
}
