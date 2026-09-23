import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://ticketapp-backend-9o6o.onrender.com/',
      '/uploads': 'https://ticketapp-backend-9o6o.onrender.com/',
    },
  },
});
