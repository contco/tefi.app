import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from 'styled-components';
import { getTransaction } from './api/transactions';

const EmptyContainer = styled.div`
  height: 100vh;
  width: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const Home: React.FC = ({ theme, changeTheme }: any) => {
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsDisplay(false);
    setTimeout(() => setIsDisplay(true), 1000);
  }, [router.pathname]);

  useEffect(() => {
   getTransaction('terra18jg24fpqvjntm2wfc0p47skqccdr9ldtgl5ac9')
  }, [])

  return (
    <div>
      {!isDisplay ? (
        <EmptyContainer />
      ) : (
        <div>
          <div>
            <Header theme={theme} changeTheme={changeTheme} />
          </div>
          <Landing />
        
        </div>
      )}
    </div>
  );
};

export default Home;
