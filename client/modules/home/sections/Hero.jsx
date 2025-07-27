// /modules/home/sections/Hero.jsx

const Hero = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-y-2">
      <h1 className="md:text-4xl text-center text-3xl mb-5 md:mb-10">Liviko</h1>
      <section className="bg-yellow-300 px-4 py-16">
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
