import AddIcon from "@/assets/actions/add.svg?react";
import SearchTextField from "@/components/common/SearchTextField";
import {
  useCreateScenario,
  useForkScenario,
} from "@/services/queries/scenario-builder/scenario-builder.queries";
import { useToastStore } from "@/store/useToastStore";
import { getErrorMessage } from "@/utils/error-helper";
import type { ScenarioFormValues } from "@/validations/scenario-builder/scenario.validation";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateScenarioModal from "./CreateScenarioModal";
import ForkScenarioModal from "./ForkScenarioModal";

interface ActionHeaderProps {
  onSearch: (value: string) => void;
  selectedScenarioId: string | null;
  onAdvancedSearchClick?: () => void;
}

const ActionHeader = ({
  onSearch,
  selectedScenarioId,
  onAdvancedSearchClick,
}: ActionHeaderProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [forkOpen, setForkOpen] = useState<boolean>(false);
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: createScenario, isPending } = useCreateScenario();
  const { mutate: forkScenario, isPending: isForking } = useForkScenario();

  const handleCreate = (data: ScenarioFormValues) => {
    createScenario(
      {
        name: data.label,
        base_currency: data.currency,
        customers: data.customer
          ? data.customer.map((id) => ({ customer_id: id }))
          : [],
      },
      {
        onSuccess: (response) => {
          setOpen(false);
          showToast(
            response.message || "Scenario created successfully",
            "success",
          );
          if (response.id) {
            navigate(`/scenario-builder/details/${response.id}`);
          }
        },
        onError: (error) => {
          showToast(
            getErrorMessage(error, "Failed to create scenario"),
            "error",
          );
        },
      },
    );
  };

  const handleFork = (newName: string) => {
    if (!selectedScenarioId) return;
    forkScenario(
      {
        scenario_id: selectedScenarioId,
        name: newName,
      },
      {
        onSuccess: (response) => {
          setForkOpen(false);
          showToast(
            response.message || "Scenario forked successfully",
            "success",
          );
          if (response.id) {
            navigate(`/scenario-builder/details/${response.id}`);
          }
        },
        onError: (error) => {
          showToast(getErrorMessage(error, "Failed to fork scenario"), "error");
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
        <SearchTextField
          onSearch={onSearch}
          onAdvancedSearchClick={onAdvancedSearchClick}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {selectedScenarioId && (
            <Button
              variant="contained"
              startIcon={<AccountTreeIcon />}
              onClick={() => setForkOpen(true)}
            >
              Fork
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Create Scenario
          </Button>
        </Box>
      </Box>
      <CreateScenarioModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
        isLoading={isPending}
      />
      <ForkScenarioModal
        open={forkOpen}
        onClose={() => setForkOpen(false)}
        onSubmit={handleFork}
        isLoading={isForking}
      />
    </>
  );
};

export default ActionHeader;
