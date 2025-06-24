
import Sidebar from "@/components/ui/Sidebar";
import { LayoutProvider } from "@/components/Contexts/LayoutProvider";

export default function RootLayout({ children }) {
  return (
    <LayoutProvider>
      <div className="mainContainer">
        <Sidebar />

        <div className="contentContainer">{children}</div>
      </div>
    </LayoutProvider>
  );
}
