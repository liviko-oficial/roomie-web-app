"use client";
import { testimonials as defaultTestimonials } from "../mock/testimonials";

const Star = () => (
  <svg className="w-4 h-4 text-[#ffd662]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TestimonialCard = ({ testimonial }) => (
  <article className="bg-white rounded-2xl p-6 shadow-md w-80 flex-shrink-0 border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-brand-accent"
      />
      <div>
        <h4 className="font-bold text-brand-dark text-sm">{testimonial.name}</h4>
        <p className="text-xs text-gray-500">{testimonial.campus}</p>
        {testimonial.career && (
          <p className="text-xs text-gray-400 italic">{testimonial.career}</p>
        )}
      </div>
    </div>
    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-5">
      "{testimonial.text}"
    </p>
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} />
      ))}
    </div>
  </article>
);

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  bgClass = "bg-white",
}) {
  // Duplicar para loop infinito (no se nota el "salto" cuando reinicia)
  const looped = [...testimonials, ...testimonials];

  return (
    <section className={`py-16 md:py-20 ${bgClass} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="mt-3 text-base md:text-lg text-brand-dark/70 max-w-2xl mx-auto">
            Estudiantes que encontraron su hogar ideal y arrendadores satisfechos.
          </p>
        </div>

        <div className="relative">
          {/* Gradients laterales para fade-in */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="testimonials-track flex gap-6 w-max">
            {looped.map((testimonial, i) => (
              <TestimonialCard
                key={`${testimonial.id ?? i}-${i}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
