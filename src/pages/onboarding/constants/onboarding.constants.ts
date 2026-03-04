import CalculateProfitStep from "@/pages/onboarding/components/CalculateProfitStep";
import CostStep from "@/pages/onboarding/components/CostStep";
import ImpactSettings from "@/pages/onboarding/components/ImpactSettings";
import SellingStep from "@/pages/onboarding/components/SellingStep";
import SetupStep from "@/pages/onboarding/components/SetupStep";
import SystemFieldMapping from "@/pages/onboarding/components/SystemFieldMapping";
import SystemIdentifier from "@/pages/onboarding/components/SystemIdentifier";
import GeneralInfo from "../components/GeneralInfo";
import SystemFieldMappingsDetails from "../components/SystemFieldMappingsDetails";

export const steps = [
  {
    label: "Setup",
    description: "Please provide your company details to get started.",
    component: SetupStep,
  },
  {
    label: "Identify Cost",
    description:
      "Let’s identify your key cost field. Priscope uses this field to calculate your gross margin across the platform. Define the one cost that best represents your core cost basis usually FOB or Landed Cost.",
    component: CostStep,
  },
  {
    label: "Identify Selling Price",
    description:
      "Now identify your main selling price field. Priscope uses this to calculate GM% and monitor margin health automatically. Define the one selling price that best represents your core selling level.for example, Wholesale, Base price, or Default Price",
    component: SellingStep,
  },
  {
    label: "How would you like Priscope to calculate profitability?",
    description:
      "Choose whether you measure profitability by Margin (%) or Markup (%). Priscope will use this method across your dashboards, scenarios, and reports. You can change it anytime later in Global settings.",
    component: CalculateProfitStep,
  },
  {
    label: "Map Your System Fields",
    component: SystemFieldMapping,
  },
  {
    label: "Map Your System Fields",
    component: SystemFieldMappingsDetails,
  },
  {
    label: "Identify Your Unique Identifier",
    description:
      "System identifier field (SKU or UPC). The selected option will be mandatory for item entry, uploads, and ERP sync",
    component: SystemIdentifier,
  },
  {
    label: "Alert Configuration",
    description:
      "Priscope can watch for changes in FX rates, tariffs, and freight that might affect your margins. You can decide how sensitive those alerts should be. When a change moves your overall or customer-level gross margin by more than the percentage you set, Priscope will create an alert in your Alerts Center so you can review and adjust pricing if needed.",
    component: ImpactSettings,
  },
  {
    label: "General Info",
    component: GeneralInfo,
  },
];
