import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/market/luna');
  }, []);

  return null;
}

// export async function getServerSideProps(_) {
//   return {
//     redirect: {
//       destination: '/market/luna',
//       permanent: false,
//     },
//   };
// }

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/col-5',
      permanent: false,
    },
  };
}
