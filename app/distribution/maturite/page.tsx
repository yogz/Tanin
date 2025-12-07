import { getMaturityByYear, getMaturityProfile } from "@/app/actions/wine-actions";
import MaturiteDistributionClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function MaturiteDistributionPage() {
    const maturityByYear = await getMaturityByYear(10);
    const currentMaturity = await getMaturityProfile();
    
    return <MaturiteDistributionClient maturityByYear={maturityByYear} currentMaturity={currentMaturity} />;
}
