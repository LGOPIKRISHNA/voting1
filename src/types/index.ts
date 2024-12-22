export interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  start_time: string;
  end_time: string;
  created_by: string;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  user_id: string;
  selected_option: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'voter';
}