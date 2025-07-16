export default function Home() {
  return (
    <div>
      <main className="flex justify-center h-screen w-screen">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="md:text-4xl text-center text-2xl md:mb-10">
            Happy Rommie
          </h1>
          <div className="flex justify-start md:flex-row flex-col gap-2">
            <button className="bg-primary-400 px-3 py-1  md:py-2 md:px-6 rounded-3xl md:text-xl text-sm">
              Primary Color
            </button>
            <button className="bg-accent-400 px-3 py-1  md:py-2 md:px-6 rounded-3xl md:text-xl text-sm">
              Accent Color
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
