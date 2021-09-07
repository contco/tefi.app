import { Box,Flex , Text} from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { Wrapper, Row, AirdropHeading, Heading, Title, StyledText, ClaimButton, SimpleText } from "../dashboardStyles";


export const TransactionHeading = Styled(Flex)`
${css({
  mb: 20,
  justifyContent: 'space-between',
  alignItems: 'center'
})}
`;

export const OvalShape = Styled(Box)`
${css({
  width:25,
  height:25,
  bg:'ovalShape',
  borderRadius:'50%'
})}
`;

export const OvalContainer = Styled(Flex)`
${css({
    width:100,
    justifyContent: 'space-between'
})}
`;

export const TransactionContainer = Styled(Flex)`
    ${css({
        flexDirection:'column',
        justifyContent:'space-between',
        width:'100%',
        height:100,
        borderRadius:5,
        p:2,
        mt:3,
        cursor:'pointer'
    })}
    &:hover {
      box-shadow:${(props) => props.theme.boxShadow};
    }
`;

export const TypeText = Styled(SimpleText)`
    ${css({
       fontWeight:'bold',
       fontSize: ['12px', null, null, null, '15px', null, null, '16px'],
    })}
`;

export const DateText = Styled(SimpleText)`
    ${css({
       fontWeight:'bold',
       fontSize: ['12px', null, null, null, null, null, null, '12px'],
       textAlign:'right'
    })}
`;

export const DetailText = Styled(Text)`
    ${css({
      color:'subHeading',
       fontSize: ['11px', null, null, null, '12px', null, null, null],
    })}
`;
