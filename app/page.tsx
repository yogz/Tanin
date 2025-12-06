import {
  getDashboardStats,
  getWinesToDrink,
  getDistributionByRegion,
  getDistributionByAppellation,
  getDistributionByCepage,
  getMaturityProfile,
  getVintageDistribution
} from "@/app/actions/wine-actions";
import { getSession } from "@/lib/auth";
import HomepageClient from "./homepage-client";

// Force dynamic rendering to avoid too many DB connections at build time
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Execute queries sequentially to avoid connection limit issues with Neon
  const stats = await getDashboardStats();
  const winesSuggestions = await getWinesToDrink(10);
  const maturity = await getMaturityProfile();
  const vintages = await getVintageDistribution();
  const byRegion = await getDistributionByRegion(10);
  const byAppellation = await getDistributionByAppellation(10);
  const byCepage = await getDistributionByCepage(10);
  const session = await getSession();

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
      userName={session?.name}
    />
  );
}
