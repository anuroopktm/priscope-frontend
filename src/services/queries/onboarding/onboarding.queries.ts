import { axiosInstance } from "@/services/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useOnboardingMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post(
        "/v1/onboarding-master/tenant/onboard",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
  });
};