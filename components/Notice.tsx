import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, Flex } from '@contco/core-ui';

const Container = styled(Flex)`
  justify-content: center;
`;

const NoticeText = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.red,
      fontSize: '19px',
      fontWeight: 600,
      mb: 2,
    })}
`;

interface Props {}

const Notice: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <NoticeText>{children}</NoticeText>
    </Container>
  );
};

export default Notice;
