import Hero from "@/modules/home/sections/Hero";
import Nav from "@/modules/home/sections/Nav";
import ThemeToggle from "@/modules/theme/components/ThemeToggle";
import styles from "@/modules/home/styles.module.css";
export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <Nav />
        <Hero />
      </main>
      <ThemeToggle className="fixed bottom-5 right-5" />
    </>
  );
}
