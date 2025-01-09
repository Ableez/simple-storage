interface EthereumProvider {
  // Request method used to interact with the provider
  request: (args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;

  // Event emitter methods
  on(eventName: string, handler: (...args: unknown[]) => void): void;
  removeListener(
    eventName: string,
    handler: (...args: unknown[]) => void,
  ): void;

  isConnected(): boolean;

  selectedAddress: string | null;
  chainId: string;

  isMetaMask?: boolean;
}

// Extend the wwindow interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
