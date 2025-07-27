"use client";
import React, { useState } from "react";
import { testimonials } from "../mock/testimonials";
import TestimonialCard from "../components/TestimonialCard";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-dark">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="mt-4 text-lg text-brand-dark max-w-3xl mx-auto">
            Estudiantes que encontraron su hogar ideal y roomies compatibles a
            través de Happy Rommie.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <TestimonialCard testimonial={testimonials[currentIndex]} />

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-brand-accent text-brand-dark hover:bg-yellow-400 transition duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-brand-accent text-brand-dark hover:bg-yellow-400 transition duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
