import { addKnownAddress } from './addKnownAddress';

export const saveAddress = async (address: string) => {
  if (!process.env.DB_ENDPOINT || !process.env.DB_TOKEN) return;
  try {
    await fetch(process.env.DB_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-Auth-Token': process.env.DB_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: addKnownAddress, variables: { input: { address } } }),
    });
  } catch (err) {
    return;
  }
};
