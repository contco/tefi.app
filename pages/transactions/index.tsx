import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import styled from 'styled-components';
import Transaction from '../../components/Transaction';
import { Box } from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';

const EmptyContainer = styled.div`
  height: 100vh;
  width: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;
const Body = Styled(Box)`
${css({
  m: 'auto',
  width: ['90%', null, '65%'],
  mt: 20,
  overflowX: ['scroll', null, null, null, null, 'hidden'],
})}
`;
const Transactions: React.FC = ({ theme, changeTheme }: any) => {
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsDisplay(false);
    setTimeout(() => setIsDisplay(true), 1000);
  }, [router.pathname]);

  return (
    <div>
      {!isDisplay ? (
        <EmptyContainer />
      ) : (
        <div>
          <div>
            <Header theme={theme} changeTheme={changeTheme} />
          </div>
          <Body>
            <Transaction />
            </Body>
        </div>
      )}
    </div>
  );
};

export default Transactions;
