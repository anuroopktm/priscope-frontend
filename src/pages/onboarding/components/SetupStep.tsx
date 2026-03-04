import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
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
}));

interface Props {
  onNext: () => void;
  isLastStep?: boolean;
}

const SetupStep = ({ onNext }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SetupStepFormValues>({
    resolver: zodResolver(setupStepSchema),
    defaultValues: {
      company_name: data.company_name ?? "",
      company_website: data.company_website ?? "",
      industry: data.industry ?? "",
      company_size: data.company_size ?? "",
      primary_location: data.primary_location ?? "",
      company_logo: data.company_logo ?? null,
    },
  });
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
        mt: 1,
      }}
    >
      <Box>
        <Typography mb={1}>Company Name *</Typography>
        <TextField
          fullWidth
          {...register("company_name")}
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& input": {
                padding: "12px 14px",
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography mb={1}>Upload Company Logo (optional)</Typography>
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
            const file = e.dataTransfer.files[0];
            if (file) setValue("company_logo", file);
          }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <img src={uploadIcon} width={35} height={35} />
          <Typography mt={1}>Drag and drop file</Typography>
          <input
            id="file-input"
            type="file"
            hidden
            accept={ACCEPTED_FILE_TYPES}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("company_logo", file);
            }}
          />
        </DropZone>
      </Box>

      <Box>
        <Typography mb={1}>Company Website</Typography>
        <TextField
          fullWidth
          {...register("company_website")}
          error={!!errors.company_website}
          helperText={errors.company_website?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 40,
              "& input": {
                padding: "12px 14px",
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography mb={1}>Industry</Typography>
        <FormControl fullWidth size="small">
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <MenuItem value="">Select an industry</MenuItem>
                <MenuItem value="Tech">Tech</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box>

      <Box>
        <Typography mb={1}>Company Size</Typography>
        <FormControl fullWidth size="small">
          <Controller
            name="company_size"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <MenuItem value="">Select company size</MenuItem>
                <MenuItem value="1-10">1-10</MenuItem>
                <MenuItem value="11-50">11-50</MenuItem>
                <MenuItem value="51-200">51-200</MenuItem>
                <MenuItem value="201-500">201-500</MenuItem>
                <MenuItem value="500+">500+</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box>

      <Box>
        <Typography mb={1}>Primary Location</Typography>
        <FormControl fullWidth size="small">
          <Controller
            name="primary_location"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <MenuItem value="">Select Primary Location</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="India">India</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box>

      <Button type="submit" variant="contained" fullWidth>
        Continue
      </Button>
    </Box>
  );
};

export default SetupStep;
