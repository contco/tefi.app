import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { Flex, Box, Text } from '@contco/core-ui';
import { Editor } from '@contco/editor';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { ModalLarge, Heading3, InputLabel, ButtonRound } from '../../UIComponents';
import { CLUB_SERVER_ROOT, TEFI_DAGORA_CONTRACT_ADDRESS } from '../../../constants';
import { simulateSendContractMsg } from '../../../transactions/sendContract';
import useWallet from '../../../lib/useWallet';
import SendModal from '../../SendModal';
import { useRepliesByThread } from '../../../data/useRepliesByThread';

const TITLE = 'Update Reply';
const EDITOR_PLACEHOLDER = 'Click anywhere to start typing';
const DEFAULT_TX_STATE = '---';

const FormContainer = styled(Flex)`
  ${css({
    alignItems: 'center',
    flexDirection: 'column',
  })}
`;

const EditorScrollContainer = styled(Box)`
  ${css({
    height: 200,
    overflowY: 'scroll',
  })}
`;

const EditorContainer = styled(Box)`
  ${css({
    width: ['calc(80vw - 40px)', null, null, 480],
    color: 'secondary',
    bg: 'postBg',
    px: 3,
    pt: 1,
  })}
`;

const StyledEditor = styled(Editor)`
  ${css({
    height: '100%',
    minHeight: [120, null, null, 140],
    width: '100%',
  })}
`;

const FeeContainer = styled(Flex)`
  ${css({
    mt: 4,
    width: ['calc(80vw - 40px)', null, null, 480],
    justifyContent: 'space-between',
    alignItems: 'center',
  })}
`;

const FeeText = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: ['8px', null, null, 0],
    fontWeight: 'bold',
  })}
`;

interface Props {
  onSend: any;
  reply: Reply;
}

const EMPTY_CONTENT = [{ type: 'paragraph', children: [{ text: '' }] }];

export const EditReplyView: React.FC<Props> = ({ onSend, reply }) => {
  const replyContent = useMemo(() => JSON.parse(reply.comment), [reply.comment]);
  const [content, setContent] = useState<any>({ raw: replyContent });
  const [txFee, setTxFee] = useState<string>(null);
  const [isTxCalculated, setIsTxCalculated] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { getMutateKey } = useRepliesByThread(reply.thread_id);
  const { useConnectedWallet } = useWallet();

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;

  const isSubmitDisabled = useMemo(() => {
    const isReplyUpdated = content.raw !== replyContent;
    const emptyContent =
      Object.keys(content).length === 0 || JSON.stringify(content?.raw) === JSON.stringify(EMPTY_CONTENT);
    if (emptyContent || !isReplyUpdated) {
      return true;
    }
    return false;
  }, [content]);

  const generateContractMsg = () => {
    if (content.raw !== replyContent) {
      return { update_comment: { comment_id: reply.comment_id, comment: JSON.stringify(content.raw) } };
    }
    return false;
  };

  const onPostSuccess = async () => {
    try {
      const updatedReply = { ...reply, comment: JSON.stringify(content.raw) };
      const body = { reply: updatedReply };
      const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET ? true : false;
      await axios.put(CLUB_SERVER_ROOT + '/dagora/thread/replies/cache?isTestnet=' + isTestnet, body);
      const key = getMutateKey(0);
      mutate(key);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async () => {
    if (!isSubmitDisabled) {
      const commentMsg = generateContractMsg();
      if (commentMsg) {
        if (!isTxCalculated) {
          setSimulationLoading(true);
          const msgs = [new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, commentMsg)];
          const result = await simulateSendContractMsg(walletAddress, msgs);
          if (!result.error) {
            setTxFee(result.fee);
            setIsTxCalculated(true);
          }
          setSimulationLoading(false);
        } else {
          const msgs = [new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, commentMsg)];
          const data = { msgs, sender: walletAddress };
          onSend(data, true, onPostSuccess);
        }
      }
    }
  };

  const onContentUpdate = (content) => {
    setContent(content);
    resetTxState();
  };

  const resetTxState = () => {
    if (isTxCalculated) {
      setIsTxCalculated(false);
      setTxFee(DEFAULT_TX_STATE);
    }
  };

  return (
    <ModalLarge>
      <Heading3>{TITLE}</Heading3>
      <FormContainer>
        <Box mt={4}>
          <InputLabel>Edit Reply</InputLabel>
          <EditorScrollContainer>
            <EditorContainer>
              <StyledEditor
                placeholder={EDITOR_PLACEHOLDER}
                placeholderStyles={{ color: 'inherit' }}
                rawData={replyContent}
                onContentUpdate={onContentUpdate}
              />
            </EditorContainer>
          </EditorScrollContainer>
        </Box>
        <FeeContainer>
          <FeeText>TxFee:</FeeText>
          <FeeText>{simulationLoading ? 'Loading...' : txFee ? `${txFee} USTC` : DEFAULT_TX_STATE}</FeeText>
        </FeeContainer>
        <Box mt={4}>
          <ButtonRound onClick={onSubmit} disabled={isSubmitDisabled}>
            {isTxCalculated ? 'Post' : 'Next'}
          </ButtonRound>
        </Box>
      </FormContainer>
    </ModalLarge>
  );
};

interface ModalProps {
  isVisible: boolean;
  setVisible: (visibleState: boolean) => void;
  reply: Reply;
}

export const EditReplyModal: React.FC<ModalProps> = ({ isVisible, setVisible, reply }) => {
  return (
    <SendModal
      isVisible={isVisible}
      setVisible={() => setVisible(false)}
      InputView={(props) => <EditReplyView {...props} reply={reply} />}
    />
  );
};
