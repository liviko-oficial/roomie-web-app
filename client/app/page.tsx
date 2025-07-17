import ThemeToggle from "@/modules/theme/components/ThemeToggle";

export default function Home() {
  return (
    <div>
      <main className="flex justify-center h-screen w-screen">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="md:text-4xl text-center text-3xl mb-5 md:mb-10">
            Happy Rommie
          </h1>
          <div className="flex justify-start md:flex-row flex-col gap-2 text-white">
            <button className="bg-primary-400 px-3 py-1  md:py-2 md:px-6 rounded-3xl md:text-xl text-lg">
              Primary Color
            </button>
            <button className="bg-accent-400 px-3 py-1  md:py-2 md:px-6 rounded-3xl md:text-xl text-lg">
              Accent Color
            </button>
          </div>
        </div>
      </main>
      <ThemeToggle className="fixed bottom-5 right-5" />
    </div>
  );
}
