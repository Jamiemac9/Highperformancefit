import AreaLandingPage, { type AreaData } from "../components/AreaLandingPage";
import areas from "../data/areas.json";

export default function PersonalTrainerHarborne() {
  return <AreaLandingPage area={areas["harborne"] as AreaData} />;
}
