import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/asset/luna');
  }, []);

  return null;
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/asset/luna',
      permanent: false,
    },
  };
}
