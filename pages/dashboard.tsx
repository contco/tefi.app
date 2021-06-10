import React from 'react';
import Head from 'next/head';
import css from '@styled-system/css'
import Styled from "styled-components";
import { Box } from "@contco/core-ui";
import Header from '../components/Header';
import Assets from "../components/Asset";
import MarketValue from "../components/MarketValue";
import Borrowing from '../components/Borrowing';
import Pools from '../components/Pools'
import Rewards from '../components/Rewards';
import {useQuery} from "@apollo/client";
import {getAssets} from "../graphql/queries/getAssets";

import useWallet from "../lib/useWallet";

const Body = Styled(Box)`
${css({
    m: 'auto',
    width: ['90%', null, '75%'],
    mt: 20,

})}
`;


const Dashboard: React.FC = ({ theme, changeTheme }: any) => {    
    const {useConnectedWallet} = useWallet();
    const connectedWallet = useConnectedWallet();
    const {data, loading, error} = useQuery(getAssets, {variables: {address: "terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m0q3"}});
    console.log(data);
    if (loading) {
        return <p>Loading</p>
    };
    
    return (
        <div>
            <Head>
                <title>Tefi App | Dashboard</title>
            </Head>
            <div>
                <Header theme={theme} changeTheme={changeTheme} address={connectedWallet?.terraAddress} />
                <Body>
                    <MarketValue />
                    <Assets mirrorAssets={data?.assets?.mirror || {}} />
                    <Borrowing />
                    <Rewards mirrorAssets={data?.assets?.mirror || {}} />
                    <Pools />
                </Body>
            </div>
        </div>
    );
};


export default Dashboard;
