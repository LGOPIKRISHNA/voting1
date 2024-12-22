import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Supabase responses
export const handlers = [
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    });
  }),
  
  http.get('*/rest/v1/profiles*', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      role: 'voter',
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());