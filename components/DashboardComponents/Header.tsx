import { Flex } from '@contco/core-ui';
import { StyledTextContainer, SimpleText } from '../dashboardStyles';

interface Data {
  name: string;
  value: string;
}

interface Props {
  data: Data[];
}

const Header: React.FC<Props> = ({ data }) => (
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

export default Header;
