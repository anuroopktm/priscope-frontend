import { type Theme } from "@mui/material/styles";
import AppBar from "./AppBar";
import Button from "./Button";
import Input from "./Input";
import Menu from "./Menu";
import Paper from "./Paper";
import Select from "./Select";
import Typography from "./Typography";

export default function ComponentsOverrides(theme: Theme) {
  return {
    ...AppBar(theme),
    ...Button(theme),
    ...Input(theme),
    ...Paper(theme),
    ...Select(theme),
    ...Typography(theme),
    ...Menu(theme),
  };
}
