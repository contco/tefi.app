import React from 'react';
import SendModal from '../../SendModal';
import { PostCommentView } from './PostCommentView';
interface Props {
  isVisible: boolean;
  setVisible: (visibleState: boolean) => void;
  replyContent: any;
  threadId: number;
}

export const PostCommentModal: React.FC<Props> = ({ isVisible, setVisible, replyContent, threadId }) => {
  return (
    <SendModal
      isVisible={isVisible}
      setVisible={() => setVisible(false)}
      InputView={(props) => (
        <PostCommentView isVisible={isVisible} threadId={threadId} replyContent={replyContent} {...props} />
      )}
    />
  );
};
