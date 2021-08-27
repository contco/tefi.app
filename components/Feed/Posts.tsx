import React from 'react';
import Post from './Post';


const Posts = ({ data }: any) => {

  if(!data  || data?.length === 0) {
    return <> </>;
  }

  return (
    <>
      {data.map((item) => (
        <Post data={item} key={item.tx} />
      ))}
    </>
  );
};

export default Posts;
