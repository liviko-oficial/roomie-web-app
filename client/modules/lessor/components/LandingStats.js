const LandingStats = () => {
  const stats = [
    { number: "200+", label: "Alumnos internacionales por semestre" },
    { number: "98%", label: "Tasa de satisfacción" },
    { number: "4,000+", label: "Estudiantes potenciales" },
    { number: "24/7", label: "Recibe y aprueba solicitudes" },
  ]

  return (
    <section className="py-12 md:py-16 bg-[#042a5c] text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-2 md:p-4">
              <div className="text-3xl md:text-5xl font-bold text-[#fdd76c] mb-1 md:mb-2">{stat.number}</div>
              <div className="text-sm md:text-xl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingStats

