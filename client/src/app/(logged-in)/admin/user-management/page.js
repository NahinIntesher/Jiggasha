import AllUsers from "@/components/Admin/UserManagement/AllUsers";
import Header from "@/components/ui/Header";
import { cookies } from "next/headers";
export default async function page() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("userRegistered");
  const response = await fetch("http://localhost:8000/allUsers/", {
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader ? `userRegistered=${cookieHeader.value}` : "",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const userData = data?.users || [];

  return (
    <div className="">
      <Header title="User Management" />
      <AllUsers userData={userData} />
    </div>
  );
}
