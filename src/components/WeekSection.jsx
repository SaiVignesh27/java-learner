import TopicCard from './TopicCard';

export default function WeekSection({ weekNumber, topics, progress, onUpdateProgress }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Week {weekNumber}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            progress={progress[topic.id]}
            onUpdateProgress={onUpdateProgress}
          />
        ))}
      </div>
    </div>
  );
}