import axios from "axios"

export const getLatestBlockHeight = async () => {
  const response = await fetch('https://lcd.terra.dev/blocks/latest');
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
  const payload = {query: LAST_SYNCED_HEIGHT_QUERY, variables: {} };
  const {data} = await axios.post("https://mantle.anchorprotocol.com/?last-synced-height", payload);
  return data?.data?.LastSyncedHeight;
}
catch(err) {
  throw new Error("Error fetching last synced height");
}
}

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
