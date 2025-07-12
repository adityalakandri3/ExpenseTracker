import { useMutation } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import { contact } from "../../../api/functions/contact";
import { toast } from "react-toastify";
import { CONTACT } from "../query-keys/QueryKeys";

export const useContact = () => {
  const { queryClient, navigate } = useGlobalHooks();
  return useMutation({
    mutationFn: contact,
    onSuccess: (response) => {
      const { status, message } = response || "";
      if (status === true) {
        toast.success(message || "Message sent successfully.");
        queryClient.invalidateQueries({ queryKey: [CONTACT] }); 
        navigate("/contact");
      }
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message;
      toast.error(`Unable to sent message. ${errMsg}`);
      console.error("Unable to sent message.", errMsg);
    },
  });
};
