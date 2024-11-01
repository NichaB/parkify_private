// app/buffer/page.js
'use client';
import { useEffect } from 'react';
import supabase from '../../config/supabaseClient'; // Adjust path as necessary

const BufferPage = () => {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('user_info')
        .select('*')
        .limit(1); // Limit to 1 row for testing

      if (error) {
        console.error('Error connecting to Supabase:', error);
      } else {
        console.log('Connection successful! Data:', data);
      }
    };

    // Call the testConnection function
    testConnection();
  }, []);

  return <div>Check console for connection test results.</div>;
};

export default BufferPage;
