// hoc/withAuth.tsx

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { ComponentType, useEffect, useState } from 'react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted || status === 'loading') return; 
      if (!session) router.push('/signin'); 
    }, [router, session, status, mounted]);

    if (!mounted || status === 'loading' || !session) {
      return <div>Loading...</div>; 
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
