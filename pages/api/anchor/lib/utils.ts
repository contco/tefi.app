import axios from 'axios';
import { LCD_URL, MANTLE_URL } from '../../utils';
import { TEFI_API } from '../../../../constants';

export const BASSETS_INFO = TEFI_API + 'https://api.anchorprotocol.com/api/v1/bassets/';

export const getLatestBlockHeight = async () => {
  const response = await fetch(LCD_URL + 'blocks/latest');
  const block = await response.json();
  return block.block.header.height;
};

export const getLastSyncedHeight = async () => {
  try {
    const LAST_SYNCED_HEIGHT_QUERY = `
  query {
    LastSyncedHeight
  }
`;
    const payload = { query: LAST_SYNCED_HEIGHT_QUERY, variables: {} };
    const { data } = await axios.post(MANTLE_URL + '?last-synced-height', payload);
    return data?.data?.LastSyncedHeight;
  } catch (err) {
    throw new Error('Error fetching last synced height');
  }
};

export const mantleFetch = (
  query: string,
  variables: any,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => {
  return fetch(endpoint, {
    ...requestInit,
    method: 'POST',
    headers: {
      ...requestInit?.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .then(({ data, errors }) => {
      if (errors) {
        return errors[0].message;
      }
      return data;
    });
};

export const formatRate = (rate) => {
  return (parseFloat(rate) * 100).toFixed(2);
};

export const MICRO = 1000000;

export const valueConversion = (value) => (parseFloat(value) / MICRO).toFixed(3);
