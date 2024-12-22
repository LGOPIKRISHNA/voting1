export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'voter';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'admin' | 'voter';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'voter';
          created_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          options: string[];
          start_time: string;
          end_time: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          options: string[];
          start_time: string;
          end_time: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          options?: string[];
          start_time?: string;
          end_time?: string;
          created_by?: string;
          created_at?: string;
        };
      };
    };
  };
}