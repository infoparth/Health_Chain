import { ThirdwebClient, createThirdwebClient, getContract } from "thirdweb";
import { polygonAmoy, sepolia } from "thirdweb/chains";
import { abi } from "./recordsabi";

// const clientId = process.env.VITE_CLIENT_ID || "";

const clientId = "a81b28f71aa45b7499e14d244942b8b2";

// const clientId = "c49961640a49b6f6dbf06792cf3ecf8c";

// export const contractAddress = "0xf57cfC89eDde16Fa372AcB9D8BFF99A32Ff8f74F";

// export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// export const contractAddress = "0x614ba8959E5f4c6D3ef6B085c6E62bf40CB33a86";

// amoy address
// export const contractAddress = "0x5A53755C431129da00dC87C103dAb6a76e0e8376";

//sepolia address
export const oldContractAddress = "0xef541C059Ff86B49F63131D20B627fDe196dF76e";
export const contractAddress = "0xbBe31a7A8c78F7e427ea16770AA611CBCa1747A8";

// export const address = "0x4b4fcc28a88E3FEE4e62Be1A98519B18c49c2De1";
export const client: ThirdwebClient = createThirdwebClient({
  clientId: clientId,
});

export const chain = polygonAmoy;

export const chain2 = sepolia;

// const testAddress = "0xCcb5D973024f1AC0672CD4a8eA3774BE805275a0";

export const Contract = getContract({
  client: client,
  chain: sepolia,
  address: contractAddress,
  abi: abi,
});

