import React from 'react';
import SendModal from '../../SendModal';
import { PostThreadView } from './PostThreadView';
interface Props {
  isVisible: boolean;
  setVisible: (visibleState: boolean) => void;
}

export const PostThreadModal: React.FC<Props> = ({ isVisible, setVisible }) => {
  return <SendModal isVisible={isVisible} setVisible={() => setVisible(false)} InputView={PostThreadView} />;
};
