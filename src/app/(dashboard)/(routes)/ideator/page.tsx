"use client";
import React, { useState } from "react";
import { z } from "zod";
import FeatureSection from "@/components/FeatureSection";

const formSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(6)
    .refine((value) => value.length <= 6, {
      message: "Maximum 6 characters are allowed",
    }),
});

const IdeatorPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const formValues = { name: event.target.value };
    const result = formSchema.safeParse(formValues);

    if (!result.success) {
      setErrorMessage(result.error.formErrors.fieldErrors.name[0]);
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formValues = { name: event.target.name.value };
    const result = formSchema.safeParse(formValues);

    if (result.success) {
      console.log(result.data);
    } else {
      console.error(result.error);
    }
  };

  return (
    <>
      <FeatureSection
        title="AI Ideator"
        form={
          <form
            onSubmit={handleSubmit}
            className="relative z-20 w-full max-w-md mx-auto mt-4"
          >
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              type="submit"
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        }
      />
    </>
  );
};

export default IdeatorPage;
