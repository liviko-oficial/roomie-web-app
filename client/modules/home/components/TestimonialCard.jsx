import React from "react";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
      <div className="flex flex-col md:flex-row items-center">
        <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-brand-accent"
          />
        </div>
        <div>
          <div className="text-brand-accent mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="inline-block w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-lg text-brand-dark italic mb-6 min-h-[10lh] md:min-h-[4lh]">
            "{testimonial.text}"
          </p>
          <div>
            <h4 className="text-xl font-bold text-brand-dark">
              {testimonial.name}
            </h4>
            <p className="text-brand-dark min-h-[2lh]">
              {testimonial.campus} - {testimonial.career}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
