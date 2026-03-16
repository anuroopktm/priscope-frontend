import { useListCurrencies } from "@/services/queries/common/common.queries";
import { useSearchCustomers } from "@/services/queries/customers/customers.queries";
import { useSearchSuppliers } from "@/services/queries/suppliers/suppliers.queries";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ScenarioAdvancedSearchProps {
  onClose?: () => void;
  onApply?: (filters: any) => void;
  filters?: any;
}

const ScenarioAdvancedSearch = ({
  onClose,
  onApply,
  filters,
}: ScenarioAdvancedSearchProps) => {
  const [sku, setSku] = useState(filters?.sku || "");
  const [supplier, setSupplier] = useState<string[]>(filters?.supplier || []);
  const [customer, setCustomer] = useState<string[]>(filters?.customer || []);
  const [baseCurrency, setBaseCurrency] = useState<string[]>(
    filters?.base_currency || [],
  );
  const [status, setStatus] = useState<string[]>(filters?.status || []);

  const { data: currencyData } = useListCurrencies({
    search: "",
    page_size: 300,
    skip: 0,
  });

  const { data: customerData } = useSearchCustomers({
    search: "",
    page_size: 300,
    skip: 0,
  });

  const { data: supplierData } = useSearchSuppliers({
    search: "",
    page_size: 300,
    skip: 0,
  });

  const handleApply = () => {
    const payload: any = {};
    if (sku) payload.sku = sku;
    if (supplier.length) payload.supplier = supplier;
    if (customer.length) payload.customer = customer;
    if (baseCurrency.length) payload.base_currency = baseCurrency;
    if (status.length) payload.status = status;

    onApply?.(payload);
  };

  const handleClear = () => {
    setSku("");
    setSupplier([]);
    setCustomer([]);
    setBaseCurrency([]);
    setStatus([]);
    onApply?.({});
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e3a5f" }}>
          Filter
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: "#6B7280" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Info Box */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          p: 1.5,
          bgcolor: "#F3F4F6",
          borderRadius: 1.5,
          alignItems: "flex-start",
        }}
      >
        <InfoOutlinedIcon sx={{ color: "#6B7280", mt: 0.3, fontSize: 20 }} />
        <Typography
          variant="caption"
          sx={{ color: "#4B5563", lineHeight: 1.5 }}
        >
          Search across all Scenario Builders to find where an Item Master is
          used.
        </Typography>
      </Box>

      {/* Scrollable Form Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          overflowY: "auto",
          pt: 1,
        }}
      >
        {/* SKU */}
        <TextField
          size="small"
          fullWidth
          label="Enter SKU"
          variant="outlined"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        {/* Supplier */}
        <FormControl size="small" fullWidth>
          <InputLabel id="supplier-label">Supplier</InputLabel>
          <Select
            labelId="supplier-label"
            label="Supplier"
            multiple
            value={Array.isArray(supplier) ? supplier : []}
            onChange={(e) => setSupplier(e.target.value as string[])}
          >
            {supplierData?.suppliers.map((s) => (
              <MenuItem key={s.id} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Customer */}
        <FormControl size="small" fullWidth>
          <InputLabel id="customer-label">Customer</InputLabel>
          <Select
            labelId="customer-label"
            label="Customer"
            multiple
            value={Array.isArray(customer) ? customer : []}
            onChange={(e) => setCustomer(e.target.value as string[])}
          >
            {customerData?.customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Base Currency */}
        <FormControl size="small" fullWidth>
          <InputLabel id="currency-label">Base Currency</InputLabel>
          <Select
            labelId="currency-label"
            label="Base Currency"
            multiple
            value={Array.isArray(baseCurrency) ? baseCurrency : []}
            onChange={(e) => setBaseCurrency(e.target.value as string[])}
          >
            {currencyData?.currencies.map((curr) => (
              <MenuItem key={curr.id} value={curr.currency}>
                {curr.description} ({curr.currency})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl size="small" fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            multiple
            value={Array.isArray(status) ? status : []}
            onChange={(e) => setStatus(e.target.value as string[])}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="partially_published">Partially Published</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Action Footer */}
      <Box
        sx={{
          borderTop: "1px solid #E5E7EB",
          pt: 1.5,
          mt: "auto",
          display: "flex",
          gap: 1.5,
        }}
      >
        <Button fullWidth variant="outlined" onClick={handleClear}>
          Clear Filters
        </Button>
        <Button fullWidth variant="contained" onClick={handleApply}>
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default ScenarioAdvancedSearch;
