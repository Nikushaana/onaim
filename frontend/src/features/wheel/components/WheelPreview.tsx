import { Paper } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import type { WheelFormValues } from "@/features/wheel/schemas/wheel.schema";

interface Props {
  segments?: WheelFormValues["segments"];
  useForm?: boolean;
}

export default function WheelPreview({ segments, useForm = false }: Props) {
  const form = useFormContext<WheelFormValues>();

  const watchedSegments = useForm
    ? useWatch({ control: form.control, name: "segments" })
    : segments;

  const finalSegments = watchedSegments || [];

  if (!finalSegments.length) {
    return <Paper sx={{ p: 2 }}>No segments</Paper>;
  }

  let startAngle = 0;

  const slices = finalSegments.map((seg) => {
    const angle = (seg.weight / 100) * 360;
    const endAngle = startAngle + angle;

    const largeArc = angle > 180 ? 1 : 0;

    const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);

    const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

    const path = `
      M 100 100
      L ${x1} ${y1}
      A 100 100 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    startAngle = endAngle;

    return <path key={seg.label} d={path} fill={seg.color} stroke="#fff" />;
  });

  return (
    <Paper sx={{ p: 2, borderRadius: 6, display: "flex", justifyContent: "center" }}>
      <svg width="250" height="250" viewBox="0 0 200 200">
        {slices}
        {/* <circle cx="100" cy="100" r="5" fill="#000" /> */}
      </svg>
    </Paper>
  );
}