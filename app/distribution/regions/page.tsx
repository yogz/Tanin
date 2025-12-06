import { getDistributionByRegion } from "@/app/actions/wine-actions";
import RegionsDistributionClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function RegionsDistributionPage() {
    const byRegion = await getDistributionByRegion();
    return <RegionsDistributionClient byRegion={byRegion} />;
}
