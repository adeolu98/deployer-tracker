export type contractData = {
  network: string;
  addresses: {
    sushiswap: string[];
    badger: string[];
  };
};

export type sheetyBodyData = {
  protocol: string;
  extraLabel: string;
  "date (withTime)": string;
  chainId: string;
  address: string;
};
