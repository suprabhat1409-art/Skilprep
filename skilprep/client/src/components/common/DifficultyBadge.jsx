const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_COLORS[difficulty] || 'bg-gray-100 text-gray-700'}`}>
      {difficulty}
    </span>
  );
}
