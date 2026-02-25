import AddIcon from "@/assets/actions/add.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import { useCreateScenario } from "@/services/queries/scenario-builder/scenario-builder.queries";
import type { ScenarioFormValues } from "@/validations/scenario-builder/scenario.validation";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import CreateScenarioModal from "./CreateScenarioModal";

interface ActionHeaderProps {
  onSearch: (value: string) => void;
}

export const ActionHeader = ({ onSearch }: ActionHeaderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: createScenario, isPending } = useCreateScenario();

  const handleCreate = (data: ScenarioFormValues) => {
    createScenario(
      {
        name: data.label,
        base_currency: data.currency,
        customers: [{ customer_name: data.customer }],
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 2,
          px: 2,
        }}
      >
        <SearchTextField onSearch={onSearch} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Scenario
        </Button>
      </Box>
      <CreateScenarioModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
        isLoading={isPending}
      />
    </>
  );
};
