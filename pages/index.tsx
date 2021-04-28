import styled from 'styled-components';
import intro from '../public/intro.gif';

const Container = styled.div`
  background-color: rgb(17, 41, 144);
  display: flex;
  flex-grow: 1;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Gif = styled.img`
  width: 100%;
  height: auto;
`;

const Title = styled.h1`
  color: orange;
  font-size: 80px;
`;

export default function Home() {
  return (
    <Container>
      <Gif src={intro} alt="loading..." />
    </Container>
  );
}
