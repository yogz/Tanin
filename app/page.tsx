import {
  getDashboardStats,
  getWinesToDrink,
  getDistributionByRegion,
  getDistributionByAppellation,
  getDistributionByCepage,
  getMaturityProfile,
  getVintageDistribution
} from "@/app/actions/wine-actions";
import HomepageClient from "./homepage-client";

export default async function DashboardPage() {
  const [stats, winesSuggestions, byRegion, byAppellation, byCepage, maturity, vintages] = await Promise.all([
    getDashboardStats(),
    getWinesToDrink(10),
    getDistributionByRegion(),
    getDistributionByAppellation(),
    getDistributionByCepage(),
    getMaturityProfile(),
    getVintageDistribution(),
  ]);

  const suggestions = winesSuggestions.slice(0, 3);

  return (
    <HomepageClient
      stats={stats}
      suggestions={suggestions}
      maturity={maturity}
      vintages={vintages}
      byRegion={byRegion}
      byAppellation={byAppellation}
      byCepage={byCepage}
    />
  );
}
