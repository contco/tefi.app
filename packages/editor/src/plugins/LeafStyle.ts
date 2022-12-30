import styled from 'styled-components';

export const Code = styled.code`
  padding: 5px;
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
  background: ${({ theme }) => (theme.colors !== undefined ? theme.colors.codeblock : '#050b210d')};
`;

export const defaultPlaceholderStyles = {
  pointerEvents: 'none',
  userSelect: 'none',
  display: 'inline-block',
  width: '0',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  verticalAlign: 'text-top',
  height: 0,
};
