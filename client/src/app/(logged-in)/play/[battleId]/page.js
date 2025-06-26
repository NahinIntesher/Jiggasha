// pages/battle/[battleId].js
import { useRouter } from "next/router";
import BattlePlay from "@/components//Battle/BattlePlay";
import HeaderAlt from "@/components/ui/HeaderAlt";

export default function BattlePage({ params }) {
  const { battleId } = params;

  const { user } = useUser();
  const userId = user ? user._id : null;
  return (
    <div>
      <HeaderAlt title="Battle Play" />
      <BattlePlay battleId={battleId} userId={userId} />
    </div>
  );
}
