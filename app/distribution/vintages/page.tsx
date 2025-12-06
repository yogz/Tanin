import { getDistributionByVintage } from "@/app/actions/wine-actions";
import VintagesDistributionClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function VintagesDistributionPage() {
    const byVintage = await getDistributionByVintage();
    return <VintagesDistributionClient byVintage={byVintage} />;
}

