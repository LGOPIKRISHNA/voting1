import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Poll, Vote } from '../types';

export function usePoll(pollId: string | undefined) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pollId) {
      fetchPollData();
    }
  }, [pollId]);

  async function fetchPollData() {
    try {
      const [pollResponse, votesResponse] = await Promise.all([
        supabase.from('polls').select('*').eq('id', pollId).single(),
        supabase.from('votes').select('*').eq('poll_id', pollId)
      ]);

      if (pollResponse.error) throw pollResponse.error;
      if (votesResponse.error) throw votesResponse.error;

      setPoll(pollResponse.data);
      setVotes(votesResponse.data);
    } catch (err) {
      console.error('Error fetching poll data:', err);
      setError('Failed to load poll data');
    } finally {
      setLoading(false);
    }
  }

  return { poll, votes, loading, error, refetch: fetchPollData };
}