import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm";
import { useAppContext } from "../contexts/useAllContext";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: async () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
