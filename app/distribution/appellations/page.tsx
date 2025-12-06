import { getDistributionByAppellation } from "@/app/actions/wine-actions";
import AppellationsDistributionClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function AppellationsDistributionPage() {
    const byAppellation = await getDistributionByAppellation();
    return <AppellationsDistributionClient byAppellation={byAppellation} />;
}
