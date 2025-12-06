import { getDistributionByCepage } from "@/app/actions/wine-actions";
import CepagesDistributionClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function CepagesDistributionPage() {
    const byCepage = await getDistributionByCepage();
    return <CepagesDistributionClient byCepage={byCepage} />;
}
