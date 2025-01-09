"use client";

import { useEffect, useState } from "react";
import Web3 from "web3";
import { type Contract } from "web3-eth-contract";
import { type AbiItem } from "web3-utils";

import { Toaster } from "#/components/ui/toaster";
import { useToast } from "#/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import abi from "../../abi.json";
import { env } from "#/env";

const contractABI = abi as AbiItem[];

export interface SimpleStorageContract
  extends Omit<Contract<typeof contractABI>, "methods"> {
  methods: {
    set(value: number): {
      send(options: { from: string }): Promise<unknown>;
      call(options?: { from: string }): Promise<void>;
    };
    get(): {
      send(options: { from: string }): Promise<unknown>;
      call(options?: { from: string }): Promise<string>;
    };
  };
}

const contractAddress = env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function SimpleStorageDApp() {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<SimpleStorageContract | null>(null);
  const [storedValue, setStoredValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isGetLoading, setIsGetLoading] = useState<boolean>(false);
  const [isSetLoading, setIsSetLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeWeb3 = async () => {
      // window.ethereum is noa set with typesafety in global.d.ts
      if (typeof window.ethereum !== "undefined") {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = (await window.ethereum.request({
            method: "eth_requestAccounts",
          })) as string[];

          if (accounts[0]) {
            setAccount(accounts[0]);
          }

          // Instantiate the contract
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress,
          ) as unknown as SimpleStorageContract;

          setContract(contractInstance);
        } catch (error) {
          console.error(
            "Error initializing web3:",
            error instanceof Error ? error.message : "Unknown error",
          );
          toast({
            title: "Error",
            description:
              "Failed to initialize Web3. Please make sure MetaMask is installed and unlocked.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to use this DApp.",
          variant: "destructive",
        });
      }
    };

    void initializeWeb3();
  }, [toast]);

  const handleSet = async () => {
    if (contract && account && inputValue) {
      setIsSetLoading(true);

      try {
        const numberValue = parseInt(inputValue, 10);
        await contract.methods.set(numberValue).send({ from: account });
        toast({
          title: "Success",
          description: "Value successfully updated!",
        });
        void handleGet();
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to set value: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
      } finally {
        setIsSetLoading(false);
      }
    }
  };

  const handleGet = async () => {
    if (contract) {
      setIsGetLoading(true);
      try {
        const result = await contract.methods.get().call();
        setStoredValue(result);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to get value: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
      } finally {
        setIsGetLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-sm">
        <CardHeader className="bg-blue-700 p-6 text-white">
          <CardTitle className="text-2xl font-bold">
            Simple Storage DApp
          </CardTitle>
          <CardDescription className="text-blue-100">
            Interact with your Ethereum smart contract
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {account ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                Connected Account: {account}
              </p>
              <div className="space-y-2">
                <Label
                  htmlFor="inputValue"
                  className="font-medium text-gray-700"
                >
                  Set Value
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="inputValue"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a number"
                    className="flex-1 border-gray-300 transition duration-200 focus:border-blue-600 focus:ring focus:ring-blue-200"
                  />
                  <Button
                    onClick={handleSet}
                    disabled={isSetLoading}
                    className="rounded bg-green-500 px-4 py-2 font-bold text-white transition duration-200 hover:bg-green-600"
                  >
                    {isSetLoading ? "Setting..." : "Set"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">
                  Stored Value
                </Label>
                <div className="flex space-x-2">
                  <Input
                    value={storedValue}
                    readOnly
                    placeholder="Stored value will appear here"
                    className="flex-1 border-gray-300 bg-gray-100"
                  />
                  <Button
                    onClick={handleGet}
                    disabled={isGetLoading}
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-200 hover:bg-blue-700"
                  >
                    {isGetLoading ? "Getting..." : "Get"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center font-bold text-red-500">
              Please connect to MetaMask
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 p-6">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gray-300 text-gray-700 transition duration-200 hover:bg-gray-100"
          >
            Refresh Connection
          </Button>
          <Button
            variant="link"
            onClick={() => window.open("https://metamask.io", "_blank")}
            className="text-blue-600 transition duration-200 hover:text-blue-800"
          >
            Install MetaMask
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
