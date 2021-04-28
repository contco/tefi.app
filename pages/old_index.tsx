import Head from 'next/head';
import styled from 'styled-components';
import { getBalance } from '../lib/anchor/anc';
import { getBorrowedValue, getBorrowLimit, getCollaterals } from '../lib/anchor/borrow';
import { desposit, getAPY, getTotalDesposit, withdraw } from '../lib/anchor/earn';

const Container = styled.div`
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: orange;
  font-size: 80px;
`;

export default function Home() {
  return (
    <Container>
      <Head>
        <title>NextJs BoilerPlate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Earn</h1>
        <button onClick={() => desposit()}>deposit</button>
        <button onClick={() => withdraw()}>withdraw</button>
        <button onClick={() => getTotalDesposit()}>getTotalDesposit</button>
        <button onClick={() => getAPY()}>getAPY</button>
      </div>
      <div>
        <h1>Borrow</h1>
        <button onClick={() => getBorrowLimit()}>getBorrowLimit</button>
        <button onClick={() => getBorrowedValue()}>getBorrowedValue</button>
        <button onClick={() => getCollaterals()}>getCollaterals</button>
      </div>
      <div>
        <h1>ANC</h1>
        <button onClick={() => getBalance()}>getBalance</button>
      </div>
    </Container>
  );
}
