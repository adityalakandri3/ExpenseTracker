import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import { signup } from "../../../Api/functions/userSignUp";
import { BUDGET, CATEGORY, EXPENSE, USERS } from "../query-keys/QueryKeys";
import { verifyOtp } from "../../../Api/functions/OtpVerify";
import { signin } from "../../../Api/functions/userSignIn";
import { toast } from "react-toastify";
import { dashboard } from "../../../api/functions/profile";
import { fetchUserProfile } from "../../../api/functions/profileData";
import { profileUpdate } from "../../../api/functions/profileUpdate";
import { updatePassword } from "../../../api/functions/updatePassword";
import { resetPasswordLink } from "../../../api/functions/resetPasswordLink";
import { resetPassword } from "../../../api/functions/resetPassword";
import { resetData } from "../../../api/functions/resetData";

export const useUserSignUpMutation = () => {
  const { queryClient, navigate } = useGlobalHooks();
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [USERS] });
        setTimeout(() => navigate("/otpverify"), 1000);
      } else {
        toast.error(data.message || "Signup failed");
        setTimeout(() => navigate("/signup"), 1000);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup error");
    },
  });
};

export const useOtpVerifyMutation = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      const { status, message } = response || {};
      if (status === true) {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: [USERS] });
        setTimeout(() => navigate("/signin"), 1000);
      } else {
        toast.error(message || "OTP verification failed");
        setTimeout(() => navigate("/otpverify"), 1000);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "OTP verification error");
    },
  });
};

export const useUserSignInMutation = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      const {
        status,
        message,
        token,
        data: { name },
      } = response || {};
      if (status === true) {
        toast.success(message);
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("message", message);
        queryClient.invalidateQueries({ queryKey: [USERS] });
        navigate("/");
      } else {
        toast.error(message || "Sign in failed");
        setTimeout(() => navigate("/signin"), 1000);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Sign in error");
    },
  });
};

export const useDashboard = (enabled = true) => {
  return useQuery({
    queryKey: [USERS],
    queryFn: dashboard,
    enabled, 
  });
};

export const useProfileFetchDetails = (id) => {
  return useQuery({
    queryKey: [USERS, id],
    queryFn: () => fetchUserProfile(id),
  });
};

export const useUpdateProfile = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: ({ id, data }) => profileUpdate(id, data),
    onSuccess: (response) => {
      const { status, message } = response || {};

      if (status === true) {
        toast.success(message || "Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: [USERS] });
        navigate("/profile");
      } else {
        toast.error(message || "Profile update failed");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Something went wrong during update"
      );
    },
  });
};

export const useUpdatePassword = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: (data) => updatePassword(data),
    onSuccess: (response) => {
      const { status, message } = response || {};
      if (status === true) {
        toast.success(message || "Password updated successfully");
        queryClient.invalidateQueries({ queryKey: [USERS] });
        navigate("/profile");
      } else {
        toast.error(message || "Password update failed");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });
};

export const useSendResetLink = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: (data) => resetPasswordLink(data),
    onSuccess: (response) => {
      const { status, message } = response || {};
      if (status === true) {
        toast.success(message || "Link to reset password has been sent to your email successfully.");
        queryClient.invalidateQueries({ queryKey: [USERS] });
        navigate("/signin");
      } else {
        toast.error(message || "Link sent failed.");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });
};

export const useResetPassword = () => {
  const { navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: (newdata) => resetPassword(newdata),
    onSuccess: (response) => {
      const { status, message } = response || {};
      if (status === true) {
        toast.success(message || "Password reset successful.");
        navigate("/signin");
      } else {
        toast.error(message || "Password reset failed.");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });
};

export const useLogout = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("message");

    queryClient.invalidateQueries({ queryKey: [USERS] });
    toast.success("Logout Successful!");
    navigate("/signin");
  };
};

export const useResetDataQuery = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: resetData,
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Data reset successfully");
        queryClient.invalidateQueries({ queryKey: [EXPENSE] });
        queryClient.invalidateQueries({ queryKey: [CATEGORY] });
        queryClient.invalidateQueries({ queryKey: [BUDGET] });

        setTimeout(() => navigate("/expenses"), 1000);
      } else {
        toast.error(data.message || "Failed to reset data");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error resetting data"
      );
    },
  });
};
