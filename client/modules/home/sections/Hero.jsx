const Hero = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-y-2">
      <section className="bg-brand-accent px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Busca tu espacio ideal cerca del Tec
            </h1>
            <p className="text-lg mb-8">
              Conectamos estudiantes foráneos con las mejores opciones de
              vivienda y roomies compatibles cerca del campus.
            </p>

            {/* Filters would go here later */}
          </div>

          <div>
            <img
              src="/group-photo.jpg"
              alt="Students together"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
