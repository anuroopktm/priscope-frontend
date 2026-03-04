import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
} from "@mui/material";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  systemIdentifierSchema,
  type SystemIdentifierFormValues,
} from "@/validations/onboarding/systemidentifier.schema";

interface Props {
  onNext: () => void;
}

const SystemIdentifier = ({ onNext }: Props) => {
  const { data, updateData } = useOnboardingStore();

  const { handleSubmit, control } =
    useForm<SystemIdentifierFormValues>({
      defaultValues: {
        system_identifier: data.system_identifier ?? "",
      },
      resolver: zodResolver(systemIdentifierSchema),
    });

  const onSubmit = (formData: SystemIdentifierFormValues) => {
    updateData(formData); // save to store
    onNext(); // go to next step
  };

  const options = [
    { value: "sku", label: "SKU" },
    { value: "upc", label: "UPC" },
  ];

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
      <Typography fontSize="14px" fontWeight={600} color="#1A2B44">
        Unique Identifier
      </Typography>

      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <Controller
          name="system_identifier"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup
                {...field}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1.5,
                  width: "100%",
                }}
              >
                {options.map((option) => {
                  const isSelected = field.value === option.value;

                  return (
                    <Box
                      key={option.value}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        p: "14px 16px",
                        border: "1.5px solid",
                        borderColor: isSelected
                          ? "#1A2B44"
                          : "#D0D5DD",
                        borderRadius: "10px",
                        cursor: "pointer",
                        backgroundColor: "#ffffff",
                        flex: 1,
                        "&:hover": { borderColor: "#1A2B44" },
                      }}
                    >
                      <FormControlLabel
                        value={option.value}
                        control={
                          <Radio
                            sx={{
                              "&.Mui-checked": {
                                color: "#1A2B44",
                              },
                              p: "0 8px 0 0",
                            }}
                          />
                        }
                        label={
                          <Typography
                            fontSize="14px"
                            fontWeight={600}
                          >
                            {option.label}
                          </Typography>
                        }
                        sx={{
                          m: 0,
                          alignItems: "center",
                          width: "100%",
                        }}
                      />
                    </Box>
                  );
                })}
              </RadioGroup>

              {fieldState.error && (
                <Typography color="error" fontSize="12px">
                  {fieldState.error.message}
                </Typography>
              )}
            </>
          )}
        />
      </FormControl>

      <Button type="submit" variant="contained" fullWidth>
        Continue
      </Button>
    </Box>
  );
};

export default SystemIdentifier;