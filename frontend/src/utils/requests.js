import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ethers } from "ethers";

const defaultOptions = {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    };

const getBuys = async () => {
	const client = new ApolloClient({
	  uri: 'https://api.thegraph.com/subgraphs/name/petie/co2terminator',
	  cache: new InMemoryCache(),
	  defaultOptions
	});

	const response = await client
						   .query({
						    query: gql`
							  query {
							  retireds {
							    id
							    retiree
							    token
							    tcoAmount,
							    usdcAmount,
							  }
							}
						    `,
						  });
	return response.data.retireds;
}

const getLeaders = async () => {
	const buys = await getBuys();
	console.log(buys);
	const buyers = buys.map(buyer => buyer.retiree);
	const buyerStats = {}
	for(const address of buyers) {
		buyerStats[address] = {
			usdcAmount: ethers.BigNumber.from("0"),
			tcoAmount: ethers.BigNumber.from("0"),
			token: []
		}
	}
	const buyerStatsFilled = buys.reduce((acc, buy) => {
		acc[buy.retiree].usdcAmount =  acc[buy.retiree].usdcAmount.add(buy['usdcAmount']);
		acc[buy.retiree].tcoAmount = acc[buy.retiree].tcoAmount.add(buy['tcoAmount']);
		acc[buy.retiree].token.push(buy['token']);

		return acc;
	}, buyerStats);

	console.log(buyerStatsFilled);

	return buyerStatsFilled;
};

export { getBuys, getLeaders };