import { useListCurrencies } from "@/services/queries/common/common.queries";
import { useSearchCustomers } from "@/services/queries/customers/customers.queries";
import {
  scenarioSchema,
  type ScenarioFormValues,
} from "@/validations/scenario-builder/scenario.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

interface CreateScenarioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScenarioFormValues) => void;
  isLoading?: boolean;
}

const CreateScenarioModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: CreateScenarioModalProps) => {
  const { control, handleSubmit, reset } = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      label: "",
      customer: "",
      currency: "",
    },
  });

  const { data: currencyData, isLoading: isCurrencyLoading } =
    useListCurrencies({
      search: "",
      page_size: 300,
      skip: 0,
    });

  const { data: customerData, isLoading: isCustomerLoading } =
    useSearchCustomers({
      search: "",
      page_size: 300,
      skip: 0,
    });

  const handleFormSubmit = (data: ScenarioFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        Scenario Builder
      </Typography>

      <Divider sx={{ borderColor: "#D2D2D2" }} />

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Controller
            name="label"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Label"
                placeholder="Enter label"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                variant="outlined"
                size="small"
              />
            )}
          />

          <Controller
            name="customer"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel id="customer-label">Customer</InputLabel>
                <Select
                  {...field}
                  labelId="customer-label"
                  label="Customer"
                  size="small"
                  variant="outlined"
                  disabled={isCustomerLoading}
                >
                  {customerData?.customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel id="currency-label">Base Currency</InputLabel>
                <Select
                  {...field}
                  labelId="currency-label"
                  label="Base Currency"
                  size="small"
                  variant="outlined"
                  disabled={isCurrencyLoading}
                >
                  {currencyData?.currencies.map((curr) => (
                    <MenuItem key={curr.id} value={curr.id}>
                      {curr.currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
          <Button size="medium" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            Done
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateScenarioModal;
