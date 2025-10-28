import { AppProviders } from "@/modules/global_components/context_files/AppProviders";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
      <main>
        <AppProviders>
          {children}
        </AppProviders>
      </main>
    </>
  );
}
