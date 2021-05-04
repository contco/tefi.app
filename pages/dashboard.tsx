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
const Body = Styled(Box)`
${css({
    m: 'auto',
    width: ['90%', null, '75%'],
    mt: 20,

})}
`;
const Dashboard: React.FC = ({ theme, changeTheme }: any) => {
    return (
        <div>
            <Head>
                <title>Tefi App | Dashboard</title>
            </Head>
            <div>
                <Header theme={theme} changeTheme={changeTheme} />
                <Body>
                    <MarketValue />
                    <Assets />
                    <Borrowing />
                    <Rewards />
                    <Pools />
                </Body>
            </div>
        </div>
    );
};


export default Dashboard;
