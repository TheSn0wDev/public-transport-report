import { ReportType } from "@prisma/client";
import { z } from "zod";

export const reportSchema = z.object({
  type: z.nativeEnum(ReportType, { message: "Invalid report type" }),
  infos: z.string().optional(),
});
