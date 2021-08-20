import React from 'react';
import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import Header from '../../components/Header';
import { Text } from '@contco/core-ui';
import css from '@styled-system/css';
import Image from 'next/image';
import { LIGHT_THEME } from '../../constants';
import { CodeBlock, atomOneLight, atomOneDark } from 'react-code-blocks';
import { CODE_EXAMPLE } from '../../constants/docs-data';
import { DOCS_SEO } from '../../next-seo.config';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  height: 300px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  ${css({
    width: ['90%', '90%', '90%', null, '50%'],
  })}
`;

const ImageContainer = styled.div`
  display: flex;
  ${css({
    width: ['90%', '90%', '90%', null, '50%'],
  })}
  margin-bottom: 50px;
`;

export const Title = styled(Text)`
  font-weight: 500;
  display: flex;
  align-items: flex-end;
  ${css({
    color: 'title',
    fontSize: [3, 6, 8, null, '39px'],
    letterSpacing: 2.5,
  })}
`;

export const MainText = styled(Text)`
  ${css({
    fontSize: [14, null, 19],
    letterSpacing: '0.83px',
    color: 'secondary',
  })}
  line-height: 200%;
`;

export const CodeContainer = styled.div`
  ${css({
    width: ['90%', '90%', '90%', null, '50%'],
  })}
`;

const Docs: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  return (
    <>
      <MainContainer>
        <NextSeo {...DOCS_SEO} />
        <Header theme={currentTheme} changeTheme={changeTheme} />
        <Container>
          <TextContainer>
            <Title>Tefi API</Title>
            <MainText>
              A powerful GraphQL API that unifies all Terra Protocols. Build cool dashboards or bots to the 🌕
            </MainText>
          </TextContainer>
          <ImageContainer>
            <Image width="800" height="400" src="/tefi-api-preview.png" alt="Picture of the author" />
          </ImageContainer>
          <MainText style={{ marginTop: '50px', marginBottom: '50px' }}>URL</MainText>
          <CodeBlock
            text="https://www.tefi.app/api"
            language="graphql"
            showLineNumbers={false}
            startingLineNumber={0}
            theme={currentTheme === LIGHT_THEME ? atomOneLight : atomOneDark}
          />
          <MainText style={{ marginTop: '50px', marginBottom: '50px' }}>Example</MainText>
          <CodeContainer>
            <CodeBlock
              text={CODE_EXAMPLE}
              language="graphql"
              showLineNumbers={false}
              startingLineNumber={0}
              theme={currentTheme === LIGHT_THEME ? atomOneLight : atomOneDark}
              style={{ width: '100%' }}
            />
          </CodeContainer>
        </Container>
      </MainContainer>
    </>
  );
};

export default Docs;
