'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TestPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (router.query.email && router.query.password) {
      setEmail(router.query.email);
      setPassword(router.query.password);
    }
  }, [router.query]);

  return (
    <div>
      <h1>Test Page</h1>
      <p>Email: {email}</p>
      <p>Password: {password}</p>
    </div>
  );
};

export default TestPage;