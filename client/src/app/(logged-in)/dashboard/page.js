import Header from "@/components/ui/Header";
import QuestPreview from "@/components/Dashboard/QuestPreview";

export default function Dashboard() {
  return (
    <div className="p-6">
      <Header title="Dashboard" />
      <QuestPreview />
    </div>
  );
}
