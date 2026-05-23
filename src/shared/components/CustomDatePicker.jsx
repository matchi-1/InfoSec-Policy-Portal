import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function CustomDatePicker({
  value,
  onChange,
  label,
  slotProps = {},
  sx = {},
  ...rest
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        {...rest}
        slotProps={{
          ...slotProps,

          textField: {
            ...(slotProps.textField ?? {}),

            sx: {
              /* ── Input text color ── */
              "& .MuiInputBase-input": {
                color: "#ffffff",
                fontSize: "0.85rem",
                padding: "0",
                // margin: "0",
              },

              /* Calendar icon color */
              "& .MuiSvgIcon-root": {
                color: "#ffffff",
                width: "1.2rem",
                height: "auto",
                padding: 0,
                margin: 0
              },

              "& .MuiOutlinedInput-root": {
                paddingRight: "0.1rem",
              },

              /* Outlined variant */
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
                // width: "100%",
                // borderRadius: "0.3rem"
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                border: "none",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "none",
                boxShadow: "none"
              },
              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
              {
                border: "none",
              },

              /* Focus-visible outline on the wrapper div */
              "& .MuiInputBase-root": {
                border: "none",
                outline: "none",
              },

              ...sx,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}