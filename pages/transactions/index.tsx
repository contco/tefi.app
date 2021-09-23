import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import styled from 'styled-components';
import Transaction from '../../components/Transaction';
import { Box, Flex } from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { getTransaction } from '../api/transactions';

const EmptyContainer = styled.div`
  height: 100vh;
  width: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;
const Body = Styled(Flex)`
${css({
  m: 'auto',
  width: ['90%', null, '65%'],
  mt: 20,
})}
`;
const Transactions: React.FC = ({ theme, changeTheme }: any) => {
  const [data, setData] = useState(null);
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsDisplay(false);
    setTimeout(() => setIsDisplay(true), 1000);
  }, [router.pathname]);

  const getTransactionFunction = async () => {
    const data = await getTransaction('terra18jg24fpqvjntm2wfc0p47skqccdr9ldtgl5ac9');
    setData(data);
  }

  useEffect(() => {
    getTransactionFunction();
    console.log(data);
   }, [data])

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
