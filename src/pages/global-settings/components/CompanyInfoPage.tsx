import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  companyInfoSchema,
  type CompanyInfoSchema,
} from "@/validations/global-settings/companyinfo.schema";
import { useListCurrencies } from "@/services/queries/common/common.queries";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { ACCEPTED_FILE_TYPES } from "@/pages/items-master-refactor/constants/upload.constants";
import {
  useGetCompanyInfo,
  useUpdateCompanyInfo,
} from "@/services/global-settings/global-setting.queries";

const DropZone = styled(Box)<{ isDragOver: boolean }>(({ theme }) => ({
  border: `1.5px dashed #90A4AE`,
  borderRadius: "10px",
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "0.2s ease",
}));

export default function CompanyInfoPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { data } = useGetCompanyInfo();
  const { mutate: updateCompanyInfo } = useUpdateCompanyInfo();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: "",
      company_website: "",
      industry: "",
      company_size: "",
      primary_location: "",
      base_currency: "",
      company_logo_url: undefined,
    },
  });

  useEffect(() => {
    if (data && currencyData) {
      const mappedCurrency =
        currencyData.currencies?.find(
          (c) =>
            c.id === data.base_currency || 
            c.currency === data.base_currency, 
        )?.id || "";

      reset({
        company_name: data.company_name || "",
        company_website: data.company_website || "",
        industry: data.industry || "",
        company_size: data.company_size || "",
        primary_location: data.primary_location || "",
        base_currency: mappedCurrency, 
        company_logo_url: data.company_logo_url || undefined,
      });
    }
  }, [data, reset]);

  const { data: currencyData, isLoading: isCurrencyLoading } =
    useListCurrencies({
      search: "",
      page_size: 300,
      skip: 0,
    });

  const onSubmit = (data: CompanyInfoSchema) => {
    const formData = new FormData();
    formData.append("company_name", data.company_name);
    formData.append("company_website", data.company_website);
    formData.append("industry", data.industry);
    formData.append("company_size", data.company_size);
    formData.append("primary_location", data.primary_location);
    formData.append("base_currency", data.base_currency);
    if (data.company_logo_url instanceof File) {
      formData.append("file", data.company_logo_url);
    }

    console.log(formData);

    updateCompanyInfo(formData);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Box sx={{ width: 420 }}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Company Info
            </Typography>

            <Typography sx={{ mb: 0.5 }}>Company Name*</Typography>
            <Controller
              name="company_name"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  size="small"
                  {...field}
                  fullWidth
                  error={!!errors.company_name}
                  helperText={errors.company_name?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Typography sx={{ mb: 0.5 }}>Base Currency*</Typography>
            <Controller
              name="base_currency"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth size="small">
                  <Select
                    {...field}
                    labelId="currency-label"
                    label="Base Currency"
                    size="small"
                    variant="outlined"
                    disabled={isCurrencyLoading}
                    error={!!fieldState.error}
                  >
                    {currencyData?.currencies.map((curr) => (
                      <MenuItem key={curr.id} value={curr.id}>
                        {curr.description} ({curr.currency})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={!!fieldState.error}>
                    {fieldState.error?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Typography sx={{ mb: 1 }}>Upload Company Logo</Typography>
            <Controller
              name="company_logo_url"
              control={control}
              render={({ field }) => {
                const value = field.value;

                const isFile = value instanceof File;
                const isUrl = typeof value === "string";

                return (
                  <>
                    <DropZone
                      isDragOver={isDragOver}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const droppedFile = e.dataTransfer.files?.[0];
                        if (droppedFile) field.onChange(droppedFile);
                      }}
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      <CloudUploadOutlinedIcon
                        sx={{ fontSize: 32, mb: 1, color: "#607D8B" }}
                      />

                      {/* ✅ HANDLE ALL CASES */}
                      {isFile ? (
                        <Typography mt={1} fontSize={12}>
                          {value.name}
                        </Typography>
                      ) : isUrl ? (
                        <Box mt={1}>
                          <img
                            src={value}
                            alt="Company Logo"
                            style={{
                              maxHeight: 60,
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      ) : (
                        <>
                          <Typography variant="body2">
                            <span
                              style={{ color: "#1976d2", cursor: "pointer" }}
                            >
                              Click to upload
                            </span>{" "}
                            or drag and drop Company Logo
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: "#9e9e9e", mt: 0.5 }}
                          >
                            SVG, PNG, JPG or GIF (max. 3MB)
                          </Typography>
                        </>
                      )}
                    </DropZone>

                    {/* ✅ FILE INPUT */}
                    <input
                      id="file-input"
                      type="file"
                      hidden
                      accept={ACCEPTED_FILE_TYPES}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) field.onChange(selectedFile);
                      }}
                    />

                    {/* ✅ REMOVE BUTTON (optional but recommended) */}
                    {value && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => field.onChange(undefined)}
                        sx={{ mt: 1 }}
                      >
                        Remove
                      </Button>
                    )}
                  </>
                );
              }}
            />

            <Typography sx={{ mb: 0.5, mt: 1 }}>Company Website*</Typography>
            <Controller
              name="company_website"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.company_website}
                  helperText={errors.company_website?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Typography sx={{ mb: 0.5 }}>Industry*</Typography>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.industry}
                  helperText={errors.industry?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Typography sx={{ mb: 0.5 }}>Company Size*</Typography>
            <Controller
              name="company_size"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.company_size}
                  helperText={errors.company_size?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Typography sx={{ mb: 0.5 }}>Primary Location*</Typography>
            <Controller
              name="primary_location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.primary_location}
                  helperText={errors.primary_location?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#1f4e6d",
            textTransform: "none",
            borderRadius: "8px",
            height: 40,
            "&:hover": {
              backgroundColor: "#163c55",
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
