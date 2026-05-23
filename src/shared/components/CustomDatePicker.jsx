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
                fontSize: "1rem !important",
                padding: "0",
                margin: "0",
              },

              /* Calendar icon color */
              "& .MuiSvgIcon-root": {
                color: "#1f4f95",
                width: "1.2rem",
                height: "auto"
              },

              /* Outlined variant */
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "3px",
                borderRadius: "0.3rem"
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


/* ─────────────────────────────────────────────
   USAGE EXAMPLE  (delete before shipping)
   ─────────────────────────────────────────────
import dayjs from "dayjs";
import CustomDatePicker from "./CustomDatePicker";

function App() {
  const [date, setDate] = useState(dayjs());

  return (
    <div style={{ background: "#1a1a2e", padding: 40 }}>
      <CustomDatePicker
        label="Select date"
        value={date}
        onChange={setDate}
        // Override padding for this instance:
        sx={{ "& input": { padding: "6px 10px" } }}
      />
    </div>
  );
}
*/