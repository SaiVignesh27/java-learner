import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useProgress() {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  async function fetchProgress() {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap = {};
      data.forEach(item => {
        progressMap[item.topic_id] = {
          status: item.status,
          notes: item.notes
        };
      });
      setProgress(progressMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProgress(topicId, status, notes = null) {
    try {
      // First, check if an entry exists
      const { data: existingData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic_id', topicId)
        .single();

      let result;
      
      if (existingData) {
        // Update existing entry
        const { data, error } = await supabase
          .from('user_progress')
          .update({
            status,
            notes,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('topic_id', topicId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            topic_id: topicId,
            status,
            notes,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setProgress(prev => ({
        ...prev,
        [topicId]: { status: result.status, notes: result.notes }
      }));

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  return { progress, loading, error, updateProgress };
}