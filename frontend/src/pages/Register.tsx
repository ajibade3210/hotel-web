import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/useAllContext";
import { useNavigate } from "react-router-dom";

// @region Type
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // @region Query -- mutation for post/patch
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Successful", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit(data => {
    mutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This filed is required" })}
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This filed is required" })}
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This filed is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This filed is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            maxLength: {
              value: 32,
              message: "Password must be at less than 32 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: val => {
              if (!val) {
                return "This filed is required";
              } else if (watch("password") !== val) {
                return "Your password do not match";
              }
            },
          })}
        ></input>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 rounded text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
