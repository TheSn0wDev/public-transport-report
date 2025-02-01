import { ReportType } from "@prisma/client";

export const getReportTypeName = (type: ReportType) => {
  switch (type) {
    case ReportType.ACCIDENT:
      return "Accident";
    case ReportType.DISRUPTION:
      return "Disruption";
    case ReportType.DELAY:
      return "Delay";
    case ReportType.HEAVY_TRAFFIC:
      return "Heavy Traffic";
    case ReportType.DEGRADATION:
      return "Degradation";
    case ReportType.EQUIPMENT_FAILURE:
      return "Equipment Failure";
    case ReportType.EVENT:
      return "Event";
    case ReportType.LOST_FOUND_OBJECT:
      return "Lost/Found Object";
    case ReportType.WEATHER_CONDITIONS:
      return "Weather Conditions";
    case ReportType.STRAY_ANIMALS:
      return "Stray Animals";
    case ReportType.SECURITY:
      return "Security issue";
    case ReportType.POLICE:
      return "Police";
    case ReportType.FIRE_DEPARTMENT:
      return "Fire Department";
    case ReportType.RESCUE:
      return "Rescue";
    case ReportType.WORKS:
      return "Works";
    case ReportType.STRIKE:
      return "Strike";
    case ReportType.CHECKPOINT:
      return "Checkpoint";
    default:
      return "Invalid type";
  }
};
