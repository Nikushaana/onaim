import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { WheelFormValues } from "@/features/wheel/schemas/wheel.schema";
import { apiGateway } from "@/shared/api/httpClient";
import toast from "react-hot-toast";
import WheelForm from "@/features/wheel/components/WheelForm";

export default function WheelCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreate = async (data: WheelFormValues) => {
    try {
      const uploadedSegments = await Promise.all(
        data.segments.map(async (segment) => {
          if (!segment.imageFile) return segment;

          const formData = new FormData();
          formData.append("file", segment.imageFile);

          const res = await apiGateway.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          return {
            ...segment,
            imageUrl: res.data.url,
          };
        }),
      );

      const payload = {
        ...data,
        segments: uploadedSegments.map(({ imageFile, ...rest }) => rest),
      };

      await apiGateway.post("/wheels", payload);

      await queryClient.invalidateQueries({ queryKey: ["wheels"] });

      toast.success("Wheel created successfully");
      navigate("/wheels");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create wheel");
    }
  };

  return <WheelForm onSubmit={handleCreate} />;
}
