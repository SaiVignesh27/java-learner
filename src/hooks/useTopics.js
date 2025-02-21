import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('order_number');

      if (error) throw error;
      setTopics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { topics, loading, error };
}