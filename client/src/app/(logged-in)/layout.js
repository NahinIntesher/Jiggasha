import Sidebar from "@/components/ui/Sidebar";
import { LayoutProvider } from "@/components/Contexts/LayoutProvider";
import { UserProvider } from "@/components/Contexts/UserProvider";

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <LayoutProvider>
        <div className="mainContainer">
          <Sidebar />
          <div className="contentContainer">{children}</div>
        </div>
      </LayoutProvider>
    </UserProvider>
  );
}
