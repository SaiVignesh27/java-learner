import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTopics } from '../hooks/useTopics';
import { useProgress } from '../hooks/useProgress';
import WeekSection from './WeekSection';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { topics, loading: topicsLoading } = useTopics();
  const { progress, loading: progressLoading, updateProgress } = useProgress();
  const [selectedWeek, setSelectedWeek] = useState(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const weeks = topics.reduce((acc, topic) => {
    if (!acc.includes(topic.week_number)) {
      acc.push(topic.week_number);
    }
    return acc.sort((a, b) => a - b);
  }, []);

  const getTopicsForWeek = (weekNumber) => {
    return topics.filter(topic => topic.week_number === weekNumber);
  };

  if (topicsLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Learning Tracker</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.user_metadata?.full_name || user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto pb-4">
              <button
                onClick={() => setSelectedWeek(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedWeek === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Weeks
              </button>
              {weeks.map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedWeek === week
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Week {week}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {(selectedWeek ? [selectedWeek] : weeks).map(week => (
              <WeekSection
                key={week}
                weekNumber={week}
                topics={getTopicsForWeek(week)}
                progress={progress}
                onUpdateProgress={updateProgress}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}