import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm";
import { useAppContext, useSearchContext } from "../contexts/useAllContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../forms/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import BookingFormPayStack from "../forms/BookingFormPayStack";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const [stripePayment, setStripePayment] = useState<boolean>(true);

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [stripePayment, search.checkIn, search.checkOut]);

  // Payment Start
  const type = stripePayment ? "stripe" : "payStack";
  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString(),
        type as string
      ),
    { enabled: !!hotelId && numberOfNights > 0 }
  );

  // Payment End

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    { enabled: !!hotelId }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (!hotel || !currentUser || !paymentIntentData) {
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {stripePayment ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm
            stripePayment={stripePayment}
            onChange={() => setStripePayment(true)}
            offChange={() => setStripePayment(false)}
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      ) : (
        <BookingFormPayStack
          stripePayment={stripePayment}
          onChange={() => setStripePayment(true)}
          offChange={() => setStripePayment(false)}
          currentUser={currentUser}
          paymentIntent={paymentIntentData}
        />
      )}
    </div>
  );
};

export default Booking;
