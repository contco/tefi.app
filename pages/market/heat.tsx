import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import data from '../../components/Bubble/dummy.json';

const HeatBubble: React.FC = ({ theme, changeTheme }: any) => {

    return (
        <div>
            <Head>
                <title>Tefi App</title>
            </Head>
            <div>
                <div>
                    <Header theme={theme} changeTheme={changeTheme} />
                </div>
                {data.map((a: any) => {
                    return <Bubble key={a.symbol} {...a} />
                })}
            </div>

        </div>
    );
};

export default HeatBubble;
