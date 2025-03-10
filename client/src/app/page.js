import ThemeSwitcher from "@/components/ThemeSwitcherButton";

export default function Home() {
  return (
    <div className="flex h-screen flex-col ">
      <div className="flex flex-1 items-center justify-center">
        Jiggasha
        <ThemeSwitcher />
      </div>
    </div>
  );
}
