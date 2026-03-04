import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import uploadIcon from "@/assets/items-master/upload-icon.svg";
import { ACCEPTED_FILE_TYPES } from "@/pages/items-master-refactor/constants/upload.constants";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setupStepSchema,
  type SetupStepFormValues,
} from "@/validations/onboarding/setupStep.schema";
import { useOnboardingStore } from "@/pages/onboarding/store/useOnboardingStore";

const DropZone = styled(Box)<{ isDragOver: boolean }>(({ theme }) => ({
  border: `1px dashed #144E72`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "0.2s ease",
}));

interface Props {
  onNext: () => void;
}

const SetupStep = ({ onNext }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SetupStepFormValues>({
    resolver: zodResolver(setupStepSchema),
    defaultValues: {
      company_name: data.company_name ?? "",
      company_website: data.company_website ?? "",
      industry: data.industry ?? "",
      company_size: data.company_size ?? "",
      primary_location: data.primary_location ?? "",
      company_logo: data.company_logo ?? undefined,
    },
  });

  const logoFile = watch("company_logo");

  const onSubmit = (formData: SetupStepFormValues) => {
    updateData(formData);
    onNext();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      {/* Company Name */}
      <Box>
        <Typography fontSize={12} mb={1}>
          Company Name *
        </Typography>
        <TextField
          fullWidth
          {...register("company_name")}
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
          size="small"
        />
      </Box>

      {/* Company Website */}
      <Box>
        <Typography fontSize={12} mb={1}>
          Company Website *
        </Typography>
        <TextField
          fullWidth
          {...register("company_website")}
          error={!!errors.company_website}
          helperText={errors.company_website?.message}
          size="small"
        />
      </Box>

      {/* Industry */}
      <Box>
        <Typography fontSize={12} mb={1}>
          Industry *
        </Typography>
        <FormControl fullWidth size="small" error={!!errors.industry}>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select {...field} displayEmpty>
                <MenuItem value="">
                  <em>Select an industry</em>
                </MenuItem>
                <MenuItem value="Tech">Tech</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.industry?.message}</FormHelperText>
        </FormControl>
      </Box>

      {/* Company Size */}
      <Box>
        <Typography fontSize={12} mb={1}>
          Company Size *
        </Typography>
        <FormControl fullWidth size="small" error={!!errors.company_size}>
          <Controller
            name="company_size"
            control={control}
            render={({ field }) => (
              <Select {...field} displayEmpty>
                <MenuItem value="">
                  <em>Select company size</em>
                </MenuItem>
                <MenuItem value="1-10">1-10</MenuItem>
                <MenuItem value="11-50">11-50</MenuItem>
                <MenuItem value="51-200">51-200</MenuItem>
                <MenuItem value="201-500">201-500</MenuItem>
                <MenuItem value="500+">500+</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.company_size?.message}</FormHelperText>
        </FormControl>
      </Box>

      {/* Primary Location */}
      <Box>
        <Typography fontSize={12} mb={1}>
          Primary Location *
        </Typography>
        <FormControl fullWidth size="small" error={!!errors.primary_location}>
          <Controller
            name="primary_location"
            control={control}
            render={({ field }) => (
              <Select {...field} displayEmpty>
                <MenuItem value="">
                  <em>Select location</em>
                </MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="India">India</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.primary_location?.message}</FormHelperText>
        </FormControl>
      </Box>

      {/* Logo Upload */}
      <Box>
        <Typography fontSize={12} mb={1}>
          Upload Company Logo (optional)
        </Typography>

        <Controller
          name="company_logo"
          control={control}
          render={({ field }) => (
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
                  const file = e.dataTransfer.files[0] ?? undefined;
                  field.onChange(file);
                }}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <img src={uploadIcon} width={35} height={35} />
                {logoFile ? (
                  <Typography mt={1} fontWeight={500}>
                    {logoFile.name}
                  </Typography>
                ) : (
                  <Typography mt={1}>
                    Link or drag and drop Company Logo
                  </Typography>
                )}
              </DropZone>

              <input
                id="file-input"
                type="file"
                hidden
                accept={ACCEPTED_FILE_TYPES}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? undefined;
                  field.onChange(file);
                }}
              />

              {/* {logoFile && (
                <Button
                  size="small"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => field.onChange(undefined)}
                >
                  Remove
                </Button>
              )} */}

              {errors.company_logo && (
                <FormHelperText error>
                  {errors.company_logo.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </Box>

      <Button type="submit" variant="contained" fullWidth>
        Continue
      </Button>
    </Box>
  );
};

export default SetupStep;
