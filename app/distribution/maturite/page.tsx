import { getMaturityByYear, getMaturityProfile } from "@/app/actions/wine-actions";
import MaturiteDistributionClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function MaturiteDistributionPage() {
    const maturityByYear = await getMaturityByYear(10);
    const maturityProfile = await getMaturityProfile();
    
    // Transform to match the expected format for MaturiteDistributionClient
    const currentMaturity = {
        keep: maturityProfile.keep,
        peak: maturityProfile.drink + maturityProfile.drinkWait,
        old: maturityProfile.old,
    };
    
    return <MaturiteDistributionClient maturityByYear={maturityByYear} currentMaturity={currentMaturity} />;
}

