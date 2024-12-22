import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Poll, Vote } from '../types';
import { format } from 'date-fns';
import { Clock, BarChart2 } from 'lucide-react';

export default function ViewPoll() {
  const { id } = useParams();
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPollData();
  }, [id]);

  async function fetchPollData() {
    try {
      // Fetch poll details
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();

      if (pollError) throw pollError;
      setPoll(pollData);

      // Fetch votes
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', id);

      if (votesError) throw votesError;
      setVotes(votesData);

      // Check if user has voted
      const userVoteData = votesData.find(vote => vote.user_id === user?.id);
      if (userVoteData) {
        setUserVote(userVoteData);
        setSelectedOption(userVoteData.selected_option);
      }
    } catch (error) {
      console.error('Error fetching poll data:', error);
      setError('Failed to load poll data');
    } finally {
      setLoading(false);
    }
  }

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    try {
      setError('');
      const { error: voteError } = await supabase
        .from('votes')
        .insert([{
          poll_id: id,
          selected_option: selectedOption
        }]);

      if (voteError) throw voteError;
      fetchPollData(); // Refresh data after voting
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit vote');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!poll) return <div>Poll not found</div>;

  const now = new Date();
  const startTime = new Date(poll.start_time);
  const endTime = new Date(poll.end_time);
  const isPollActive = now >= startTime && now <= endTime;

  // Calculate results
  const results = poll.options.reduce((acc, option) => {
    acc[option] = votes.filter(v => v.selected_option === option).length;
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = votes.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
        <p className="text-gray-600 mb-4">{poll.description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Clock className="h-4 w-4 mr-1" />
          <span>
            {format(startTime, 'MMM d, yyyy h:mm a')} -{' '}
            {format(endTime, 'MMM d, yyyy h:mm a')}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option} className="relative">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  {!userVote && isPollActive && (
                    <input
                      type="radio"
                      name="poll-option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                  )}
                  <label className={`ml-3 ${!isPollActive || userVote ? 'text-gray-700' : ''}`}>
                    {option}
                  </label>
                </div>
                {(userVote || !isPollActive) && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {((results[option] || 0) / totalVotes * 100).toFixed(1)}%
                    </span>
                    <BarChart2 className="h-4 w-4 ml-2 text-gray-400" />
                  </div>
                )}
              </div>
              {(userVote || !isPollActive) && (
                <div
                  className="absolute top-0 left-0 h-full bg-indigo-50 rounded-lg transition-all"
                  style={{
                    width: `${(results[option] || 0) / totalVotes * 100}%`,
                    zIndex: -1
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {!userVote && isPollActive && (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            Submit Vote
          </button>
        )}

        {userVote && (
          <div className="mt-6 text-center text-sm text-gray-500">
            You voted for: <span className="font-medium text-gray-900">{userVote.selected_option}</span>
          </div>
        )}

        {!isPollActive && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {now < startTime ? 'This poll has not started yet' : 'This poll has ended'}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Total votes: {totalVotes}
        </div>
      </div>
    </div>
  );
}