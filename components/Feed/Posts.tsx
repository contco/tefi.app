import React from 'react';
import Post from './Post';

const Posts = ({ data, currentTheme }: any) => {
  if (!data || data?.length === 0) {
    return <> </>;
  }

  return (
    <>
      {data.map((item) => (
        <Post data={item} key={item.tx} currentTheme={currentTheme} />
      ))}
    </>
  );
};

export default Posts;
