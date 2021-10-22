export const addKnownAddress = `
  mutation addTerraKnownAddress($input:[AddTerraKnownAddressInput!]!) {
    addTerraKnownAddress(input: $input) {
        terraKnownAddress {
            address
        }
    }
  }
`;
