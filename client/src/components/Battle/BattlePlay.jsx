// components/BattlePlay.jsx
import { useState } from "react";
import useBattleSocket from "../hooks/useBattleSocket";

export default function BattlePlay({ battleId, userId }) {
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [eliminated, setEliminated] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);

  const { submitAnswer } = useBattleSocket({
    battleId,
    userId,
    onQuestion: setQuestion,
    onResult: setFeedback,
    onEnd: () => setBattleEnded(true),
    onElimination: () => setEliminated(true),
  });

  if (eliminated)
    return <div className="p-4 text-red-600">You have been eliminated 😢</div>;
  if (battleEnded)
    return <div className="p-4 text-green-600">Battle ended 🎉</div>;

  return (
    <div className="p-4 space-y-4">
      {question ? (
        <div>
          <h2 className="text-xl font-bold">Question #{question.sequence}</h2>
          <p>Question ID: {question.questionId}</p>

          <div className="space-x-2 mt-4">
            {["a", "b", "c", "d"].map((opt) => (
              <button
                key={opt}
                onClick={() => submitAnswer(question.questionId, opt)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Option {opt.toUpperCase()}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 text-lg">
              {feedback.isCorrect ? (
                <span className="text-green-600">✅ Correct</span>
              ) : (
                <span className="text-red-600">❌ Wrong</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Waiting for next question...</div>
      )}
    </div>
  );
}
