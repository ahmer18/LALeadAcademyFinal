import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { useFeedback } from "../../providers/FeedbackProvider";
import useAuth from "../../hooks/useAuth";

// Create Payment Intent when component mounts or course changes
const createPaymentIntent = async ({ queryKey }) => {
  const [_id, { courseId }] = queryKey;
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/create-payment-intent`,
    { courseId }
  );
  return response.data.clientSecret;
};

const StripeCheckoutForm = ({ courseDetails }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { showFeedback } = useFeedback();

  const { data: clientSecret } = useQuery({
    enabled: !!courseDetails?._id,
    queryKey: ["stripePaymentIntent", { courseId: courseDetails?._id }],
    queryFn: createPaymentIntent,
  });

  // Save payment info to the server with useMutation
  const savePaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/enrollments`,
        paymentData
      );
      return response.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
        },
      }
    );

    if (error) {
      console.log("Payment Error:", error.message);
      showFeedback("Payment failed: " + error.message, "error");
    } else {
      const enrollmentData = {
        courseId: courseDetails._id,
        email: user.email,
        price: courseDetails.price,
        paymentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
        createdAt: new Date().toISOString(),
      };
      // Save payment info to the server
      await savePaymentMutation.mutateAsync(enrollmentData);
      showFeedback("Payment successful!, Continue Learning", "success");
      navigate("/dashboard/courses");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 shadow rounded border border-gray-200"
    >
      <CardElement className="border p-2 rounded mb-4" />
      <button
        type="submit"
        disabled={!stripe || !clientSecret || savePaymentMutation.isPending}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        {savePaymentMutation.isPending ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
