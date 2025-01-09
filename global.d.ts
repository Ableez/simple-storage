// Type definitions for Ethereum provider
interface EthereumProvider {
  request: (args: {
    method: "eth_requestAccounts";
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

// Extend the window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// EXPORT TO MAKE IT ACCESSIBLE
export {};
