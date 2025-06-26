import Header from "@/components/ui/Header";
import { useUser } from "@/components/Contexts/UserProvider";
import Link from "next/link";

export default function Play() {
  let battleId = "battle-12345";
  let PairToPairbattleId = "pair-to-pair-battle-12345";

  return (
    <div className="">
      <Header title="Learn Through Play" />
      <div className="flex gap-3 items-center justify-center h-screen">
        <Link
          href={`/${battleId}`}
          className="bg-orange-200 border p-4 mb-4 border-gray-500 text-black  rounded-xl"
        >
          <span>Battle Royal</span>
        </Link>
        <Link
          href={`/${PairToPairbattleId}`}
          className="bg-orange-50 border p-4 mb-4 border-gray-500 text-black  rounded-xl"
        >
          <span>Pair To Pair Battle</span>
        </Link>
        <Link
          href={`Create A Room`}
          className="bg-orange-50 border p-4 mb-4 border-gray-500 text-black  rounded-xl"
        >
          <span>Create A Room</span>
        </Link>
      </div>
    </div>
  );
}
