"use server";

import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/schemas/report";
import { Report, ReportType } from "@prisma/client";

export async function createReport(
  type: ReportType,
  infos: string | undefined,
  location: [number, number]
): Promise<{ errors: Record<string, string[]> } | Report> {
  const validatedFields = reportSchema.safeParse({
    type,
    infos,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const report = await prisma.report.create({
    data: {
      type,
      infos,
      location: JSON.stringify(location),
    },
  });

  return report;
}
