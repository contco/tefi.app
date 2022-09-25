import React from 'react';
import SendModal from '../../SendModal';
import { EditThreadView } from './EditThreadView';
interface Props {
  isVisible: boolean;
  setVisible: (visibleState: boolean) => void;
  thread: Thread;
}

export const EditThreadModal: React.FC<Props> = ({ isVisible, setVisible, thread }) => {
  return (
    <SendModal
      isVisible={isVisible}
      setVisible={() => setVisible(false)}
      InputView={(props) => <EditThreadView {...props} thread={thread} />}
    />
  );
};
