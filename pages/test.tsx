import styled from 'styled-components';
import { useLazyQuery } from '@apollo/client';
import { GET_EARN_DATA } from "../graphql/anc";

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

const address = 'terra1amhhduzslqngw40fp2f28zse0mnghrmwf3apnm';

export default function Test() {
    const [getEarnData, { loading, data }] = useLazyQuery(GET_EARN_DATA);
    if (loading) return <p>Loading ...</p>;
    const handleGetEarnData = () => {
        getEarnData({ variables: { address: address } });
        console.log(data);
    }
    return (
        <Container>
            <button onClick={handleGetEarnData}> get earn data</button>
        </Container>
    );
}
