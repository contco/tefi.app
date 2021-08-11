import React from 'react';
import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import Header from '../../components/Header';
import { Text } from '@contco/core-ui';
import css from '@styled-system/css';
import Image from 'next/image';
import { LIGHT_THEME, TEFI_API_PREVIEW_IMAGE } from '../../constants';
import { CodeBlock, atomOneLight, atomOneDark } from 'react-code-blocks';
import { CODE_EXAMPLE } from '../../constants/docs-data';

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

const Docs: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  return (
    <MainContainer>
      <NextSeo
        title="TefiApp - Docs"
        description=""
        canonical="https://tefi.app/api"
        openGraph={{
          url: 'https://tefi.app/api',
          title: 'TefiApp - Docs',
          description: '',
          images: [
            {
              url: TEFI_API_PREVIEW_IMAGE,
              alt: 'tefi api preview page',
              width: 1200,
              height: 630,
            },
          ],
          site_name: 'SiteName',
        }}
        twitter={{
          handle: '@tefiapp',
          cardType: 'summary_large_image',
        }}
      />
      <Header theme={currentTheme} changeTheme={changeTheme} hideCharts />
      <Container>
        <TextContainer>
          <Title>Tefi API</Title>
          <MainText>
            A powerful GraphQL API that unifies all Terra Protocols. Build cool dashboards or bots to the 🌕
          </MainText>
        </TextContainer>
        <ImageContainer>
          <Image width="800" height="560" src={TEFI_API_PREVIEW_IMAGE} alt="Picture of the author" />
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
        <CodeBlock
          text={CODE_EXAMPLE}
          language="graphql"
          showLineNumbers={false}
          startingLineNumber={0}
          theme={currentTheme === LIGHT_THEME ? atomOneLight : atomOneDark}
        />
      </Container>
    </MainContainer>
  );
};

export default Docs;
