export const getLatestBlockHeight = async () => {
  const response = await fetch('https://lcd.terra.dev/blocks/latest');
  const block = await response.json();
  return block.block.header.height;
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
