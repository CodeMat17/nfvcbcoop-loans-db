import MembersData from "@/components/admin/MembersData";
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

const AdminDashboard = async () => {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  return (<MembersData />
  );
};

export default AdminDashboard;
