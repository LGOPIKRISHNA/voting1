import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Poll } from '../types';
import { format } from 'date-fns';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPolls(data || []);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Active Polls</h1>
        {user?.role === 'admin' && (
          <Link
            to="/create-poll"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Poll
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Link
            key={poll.id}
            to={`/polls/${poll.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{poll.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{poll.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {format(new Date(poll.start_time), 'MMM d, yyyy')} -{' '}
                  {format(new Date(poll.end_time), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                <span>{poll.options.length} options</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No polls available</p>
        </div>
      )}
    </div>
  );
}