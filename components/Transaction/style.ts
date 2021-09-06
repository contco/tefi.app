import { Box,Flex , Text} from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';

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
        border:'2px solid red',
        p:1,
    })}
`;

export const TypeText = Styled(Text)`
    ${css({
       fontWeight:'bold',
    })}
`;


