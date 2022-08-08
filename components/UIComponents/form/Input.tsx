import styled from 'styled-components';
import css from '@styled-system/css';

interface InputProps {
  error?: boolean;
}
export const Input = styled.input<InputProps>`
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: ${(props) => props.theme.colors.secondary};
    -webkit-box-shadow: 0 0 0px 0px ${(props) => props.theme.colors.postBg} inset;
    transition: background-color 5000s ease-in-out 0s;
  }
  ${(props) =>
    css({
      height: [28, null, 38, 48],
      width: ['calc(80vw - 40px)', null, null, 480],
      border: 0,
      bg: 'postBg',
      color: 'secondary',
      fontSize: [1, null, null, null, 2],
      px: 3,
      letterSpacing: 1,
      outline: props.error ? '1px solid #e74c3c' : 0,
      '&::placeholder': {
        color: 'secondary',
        fontSize: [1, null, null, null, 2],
        letterSpacing: 1,
      },
    })}
`;
