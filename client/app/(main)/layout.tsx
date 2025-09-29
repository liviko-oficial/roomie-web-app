import NavBar from "@/modules/home/sections/NavBar";
import { AppProviders } from "@/modules/context_files/AppProviders";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
      <main>
        <AppProviders>
          <NavBar />
          {children}
        </AppProviders>
      </main>
    </>
  );
}
