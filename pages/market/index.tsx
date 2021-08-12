import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/market/uluna');
  }, []);

  return null;
}

export async function getServerSideProps(_) {
  return {
    redirect: {
      destination: '/market/uluna',
      permanent: false,
    },
  };
}
