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

// Force dynamic rendering to avoid too many DB connections at build time
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Execute queries sequentially to avoid connection limit issues with Neon
  const stats = await getDashboardStats();
  const winesSuggestions = await getWinesToDrink(10);
  const maturity = await getMaturityProfile();
  const vintages = await getVintageDistribution();
  const byRegion = await getDistributionByRegion();
  const byAppellation = await getDistributionByAppellation();
  const byCepage = await getDistributionByCepage();

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
