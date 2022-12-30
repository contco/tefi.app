import React, { FC, forwardRef, Ref } from 'react';
import Box from "../layout/Box";

const TextArea: FC<any> = forwardRef((props: any, ref: Ref<HTMLDivElement>) => (
  <Box ref={ref} as="textarea" height="50px" width="300px" bg="white" m="20px" {...props} />
));

export default TextArea;
