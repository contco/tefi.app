import { Flex } from '@contco/core-ui';
import { StyledTextContainer, SimpleText, StyledText } from '../dashboardStyles';
interface Data {
  name: string;
  value: string;
}

interface Props {
  data: Data[] | string;
}

const Header: React.FC<Props> = ({ data }) => {
  if (typeof data === 'string') return <StyledText>{data}</StyledText>;

  return (
    <Flex>
      {data.map((d, index) => (
        <StyledTextContainer key={index}>
          <SimpleText>
            <b>{d.name}: </b> &nbsp;
          </SimpleText>
          <SimpleText>{d.value}</SimpleText>
        </StyledTextContainer>
      ))}
    </Flex>
  );
};

export default Header;
