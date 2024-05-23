import { ThirdwebClient, createThirdwebClient, getContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { abi } from "./recordsabi";

// const clientId = process.env.VITE_CLIENT_ID || "";

const clientId = "a81b28f71aa45b7499e14d244942b8b2";

export const contractAddress = "0xf57cfC89eDde16Fa372AcB9D8BFF99A32Ff8f74F";

export const address = "0x4b4fcc28a88E3FEE4e62Be1A98519B18c49c2De1";
export const client: ThirdwebClient = createThirdwebClient({
  clientId: clientId,
});

export const chain = polygonAmoy;

const testAddress = "0xCcb5D973024f1AC0672CD4a8eA3774BE805275a0";

export const Contract = getContract({
  client: client,
  chain: polygonAmoy,
  address: contractAddress,
  abi: abi,
});
