import MainContainer from "@/components/main-container";
import { prisma } from "@/lib/prisma";

export function fetchReports() {
  return prisma.report.findMany().then((reports) => reports);
}

export default async function Home() {
  const reports = await fetchReports();

  return <MainContainer initialData={reports} />;
}
