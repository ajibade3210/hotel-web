import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useMutation, useQuery } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm";
import { useAppContext } from "../contexts/useAppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  const { data: hotel } = useQuery(
    "fetchMyHotelsById",
    () => apiClient.fetchMyHotelsById(hotelId || ""),
    { enabled: !!hotelId }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelsById, {
    onSuccess: () => {
      showToast({ message: "Hotel updated successfully!!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel Details", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  );
};

export default EditHotel;
