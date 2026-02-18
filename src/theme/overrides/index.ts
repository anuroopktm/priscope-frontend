import { type Theme } from "@mui/material/styles";
import Button from "./Button";
import Input from "./Input";
import Paper from "./Paper";
import Typography from "./Typography";

export default function ComponentsOverrides(theme: Theme) {
  return {
    ...Button(),
    ...Input(theme),
    ...Paper(),
    ...Typography(theme),
  };
}
