import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TopicCard({ topic, progress, onUpdateProgress }) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(progress?.notes || '');

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    unread: 'bg-gray-100 text-gray-800'
  };

  const handleStatusChange = async (status) => {
    try {
      await onUpdateProgress(topic.id, status, notes);
      toast.success(`Topic marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNotesSubmit = async () => {
    try {
      await onUpdateProgress(topic.id, progress?.status || 'unread', notes);
      setIsEditing(false);
      toast.success('Notes updated successfully');
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
          <p className="text-sm text-gray-500">{topic.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[progress?.status || 'unread']
        }`}>
          {progress?.status || 'unread'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange('completed')}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Complete
          </button>
          <button
            onClick={() => handleStatusChange('in-progress')}
            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange('unread')}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Mark Unread
          </button>
        </div>

        <div>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Add your notes here..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleNotesSubmit}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {progress?.notes && (
                <p className="text-sm text-gray-600">{progress.notes}</p>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                {progress?.notes ? 'Edit Notes' : 'Add Notes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}