import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
import { Editor } from '@contco/editor';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { ModalLarge, Heading3, InputLabel, Input, ButtonRound } from '../../UIComponents';
import { TEFI_DAGORA_CONTRACT_ADDRESS } from '../../../constants';
import { simulateSendContractMsg } from '../../../transactions/sendContract';
import useWallet from '../../../lib/useWallet';

const TITLE = 'Update Thread';
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
  thread: Thread;
}

const EMPTY_CONTENT = [{ type: 'paragraph', children: [{ text: '' }] }];

export const EditThreadView: React.FC<Props> = ({ onSend, thread }) => {
  const threadContent = useMemo(() => JSON.parse(thread.content), [thread.content]);
  const [title, setTitle] = useState<string>(thread.title);
  const [content, setContent] = useState<any>({ raw: threadContent });
  const [txFee, setTxFee] = useState<string>(null);
  const [isTxCalculated, setIsTxCalculated] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { useConnectedWallet } = useWallet();

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;

  const onPostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    resetTxState();
  };

  const isSubmitDisabled = useMemo(() => {
    const isThreadUpdated = content.raw !== threadContent || title.trim() !== thread.title;
    const emptyContent =
      Object.keys(content).length === 0 || JSON.stringify(content?.raw) === JSON.stringify(EMPTY_CONTENT);
    if (title.trim() === '' || emptyContent || !isThreadUpdated) {
      return true;
    }
    return false;
  }, [content, title]);

  const generateContractMsg = () => {
    if (title.trim() !== thread.title && content.raw !== threadContent) {
      return { update_thread: { id: thread.id, content: JSON.stringify(content.raw), title } };
    } else if (content.raw !== threadContent) {
      return { update_thread_content: { id: thread.id, content: JSON.stringify(content.raw) } };
    } else if (title.trim() !== threadContent.title) {
      return { update_thread_title: { id: thread.id, title } };
    } else return false;
  };

  const onSubmit = async () => {
    if (!isSubmitDisabled) {
      const threadMsg = generateContractMsg();
      if (threadMsg) {
        if (!isTxCalculated) {
          setSimulationLoading(true);
          const msgs = [new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, threadMsg)];
          const result = await simulateSendContractMsg(walletAddress, msgs, true);
          if (!result.error) {
            setTxFee(result.fee);
            setIsTxCalculated(true);
          }
          setSimulationLoading(false);
        } else {
          const msgs = [new MsgExecuteContract(walletAddress, TEFI_DAGORA_CONTRACT_ADDRESS, threadMsg)];
          const data = { msgs, sender: walletAddress };
          onSend(data, true);
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
          <InputLabel>Title</InputLabel>
          <Input
            defaultValue={thread.title}
            onChange={onPostInput}
            name="title"
            type="text"
            placeholder="Write Title"
          />
        </Box>
        <Box mt={4}>
          <InputLabel>Content</InputLabel>
          <EditorScrollContainer>
            <EditorContainer>
              <StyledEditor
                placeholder={EDITOR_PLACEHOLDER}
                placeholderStyles={{ color: 'inherit' }}
                rawData={threadContent}
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
