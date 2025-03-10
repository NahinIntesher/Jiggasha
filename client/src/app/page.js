import ThemeSwitcher from "@/components/ThemeSwitcherButton";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <ThemeSwitcher />
      <div className="flex flex-1 flex-col items-center justify-center">
        Jiggasha
        <div>
          <p className="text-center">
            Jiggasha is a platform for learning and sharing knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}
