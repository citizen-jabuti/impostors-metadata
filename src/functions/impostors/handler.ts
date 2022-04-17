import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import env from '@libs/env';
import axios from 'axios';
import { ethers } from 'ethers';

const nftAddress = "0x3110ef5f612208724ca51f5761a69081809f03b7";
const stakerAddress = "0xF9936bC175F4777d85351738EF869B3ad7E7072d";
const stakerAbi = [
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"itemStatuses","outputs":[{"internalType":"uint256","name":"stakedPool","type":"uint256"},{"internalType":"uint256","name":"stakedAt","type":"uint256"},{"internalType":"uint256","name":"tokenClaimed","type":"uint256"}],"stateMutability":"view","type":"function"}
];

const provider = new ethers.providers.JsonRpcProvider(env.WEB3_URL);
const contract = new ethers.Contract(stakerAddress, stakerAbi, provider);

const poolLookup = {
  "0": "None",
  "1": "Flexible",
  "2": "30 Days",
  "3": "60 Days",
  "4": "90 Days",
}

const metadata: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { tokenId } = event.pathParameters;
  const url = `https://impostors-meta.s3.amazonaws.com/${tokenId}`;
  const [metadata, itemStatus] = await Promise.all([
    axios.get(url).then(resp => resp.data),
    contract.itemStatuses(nftAddress, tokenId),
  ]);
  // console.log(metadata);
  // console.log(itemStatus);

  const attributes = metadata.attributes;
  attributes.push({
    trait_type: "Staked",
    value: (itemStatus.stakedPool > 0).toString(),
  });
  attributes.push({
    trait_type: "Staking Pool",
    value: poolLookup[itemStatus.stakedPool],
  });

  console.log(metadata);

  return formatJSONResponse(metadata);
}

export const main = middyfy(metadata);
