import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import {
  BookingFormPayStackData,
  PaymentIntentResponse,
  PayStackResponse,
  UserType,
} from "../config/hotel-options-config";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useMutation } from "react-query";
import { useAppContext, useSearchContext } from "../contexts/useAllContext";
import { useNavigate, useParams } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";

type Props = {
  stripePayment: boolean;
  onChange: (value?: boolean | undefined) => void;
  offChange: (value?: boolean | undefined) => void;
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

const BookingFormPayStack = ({
  stripePayment,
  onChange,
  offChange,
  currentUser,
  paymentIntent,
}: Props) => {
  console.log({ stripePayment });
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { hotelId } = useParams();
  const search = useSearchContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register } = useForm<BookingFormPayStackData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const config = {
    reference: new Date().getTime().toString(),
    email: "bluemajic321@gmail.com",
    publicKey: "pk_test_7977226430f252a4dbc9908133919ff95c132635",
    amount: parseInt(paymentIntent.totalCost.toFixed(2))
  };

  const initializePayment = usePaystackPayment(config);

  const onSubmit = async (formData: BookingFormPayStackData) => {
    const onSuccess = (result: PayStackResponse) => {
      if (result.status === "success") {
        bookRoom({
          ...formData,
          paymentIntentId: result.reference,
          type: stripePayment ? "stripe" : "payStack",
        });
        // navigate("/my-bookings");
      }
      showToast({
        message: "Payment successfully completed!",
        type: "SUCCESS",
      });
    };

    const onClose = () => {
      showToast({ message: "Error Payment fail!", type: "ERROR" });
    };

    initializePayment({ onSuccess, onClose });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-purple-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-purple-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ${paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xl font-semibold">Payment Details</div>
        <h3>Select Payment Type: </h3>
        <span
          onClick={() => onChange()}
          className="cursor-pointer p-2 text-purple-500 font-bold text-sm"
        >
          Stripe
        </span>
        <span
          onClick={() => offChange()}
          className="cursor-pointer p-2 text-blue-500 font-bold text-sm"
        >
          Paystack
        </span>
        {stripePayment && (
          <CardElement
            id="payment-element"
            className="border rounded-md p-2 text-sm"
          />
        )}
      </div>
      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving.." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingFormPayStack;
