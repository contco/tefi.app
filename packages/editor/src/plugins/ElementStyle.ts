import styled from 'styled-components';

export const Paragraph = styled.p`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.67px;
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;

export const CodeBlock = styled.div`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 2px;
  width: max-content;
  padding: 10px;
  padding-bottom: 30px;
  padding-right: 50px;
`;

export const BlockQuote = styled.blockquote`
  font-style: normal;
  font-size: 16px;
  min-height: 30px;
  border-left: 4px solid ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#000')};
  padding-left: 8px;
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;
export const NumberList = styled.ol`
  font-style: normal;
  font-size: 16px;
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;
export const BulletList = styled.li`
  font-style: normal;
  font-size: 16px;
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;

export const Triangle = styled.span`
  width: 0;
  height: 0;
  border: solid 8px;
  border-color: transparent transparent #050b21 transparent;
  margin: 0 auto;
  display: flex;
`;

export const Rectangle = styled.span`
  width: max-content;
  padding: 0px 5px;
  height: 20px;
  border-radius: 2px;
  background-color: #050b21;
  font-size: 8px;
  letter-spacing: 0.33px;
  color: #ffffff !important;
  display: flex;
  align-items: center;
`;

export const LinkContainer = styled.span`
  z-index: 2;
  position: absolute;
  display: inline-block;
  width: max-content;
  top: 130%;
  left: 50%;
  margin-top: 2px;
  transform: translate(-50%, -50%);
  display: none;
`;
export const Link = styled.a`
  position: relative;
  &:hover ${LinkContainer} {
    display: initial;
  }
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.link : '#050b21')};
  }
  text-decoration: underline;
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.link : '#050b21')};
`;

export const Heading1 = styled.h1`
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;

export const Heading2 = styled.h2`
  color: ${({ theme }) => (theme.colors !== undefined ? theme.colors.text : '#050b21')};
`;
