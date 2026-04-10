// Componente para las estrellas de valoración
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-[#fdd76c]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}.0/5.0</span>
    </div>
  )
}

const LandingTestimonials = () => {
  const testimonials = [
    {
      quote:
        "Desde que publiqué mi departamento en Happy Roomie, no he tenido ni un solo mes sin inquilinos. ¡Los pagos siempre llegan a tiempo!",
      author: "María González",
      role: "Propietaria en Zapopan",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
      rating: 5,
    },
    {
      quote:
        "La verificación de estudiantes me da tranquilidad. Sé que estoy rentando a jóvenes responsables y con respaldo institucional.",
      author: "Carlos Ramírez",
      role: "Arrendador desde 2021 en Guadalajara",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
      rating: 4,
    },
    {
      quote:
        "Tenía miedo de rentar mi casa, pero el equipo de Happy Roomie me guió en todo el proceso. Ahora tengo ingresos extra sin preocupaciones.",
      author: "Laura Martínez",
      role: "Propietaria en Zapopan",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
      rating: 5,
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-white text-[#042a5c]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
          Lo que dicen nuestros arrendadores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-lg flex flex-col">
              <div className="text-3xl md:text-4xl font-serif text-[#fdd76c] mb-2 md:mb-4">"</div>
              <p className="text-base md:text-lg italic mb-4 md:mb-6">{testimonial.quote}</p>
              <div className="mt-auto flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#fdd76c]"
                />
                <div className="ml-3 md:ml-4">
                  <p className="font-bold text-base md:text-lg">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingTestimonials

