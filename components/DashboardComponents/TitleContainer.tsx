import React from 'react';
import { Row, Title } from '../dashboardStyles';

interface Props {
  titles: string[];
}

const TitleContainer: React.FC<Props> = ({ titles }) => {
  return (
    <Row>
      {titles.map((t, index) => (
        <Title key={index}>{t}</Title>
      ))}
    </Row>
  );
};

export default TitleContainer;
