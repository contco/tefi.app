import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import data from '../../components/Bubble/dummy.json';
import { price } from '../api/mirror/utils';

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
                {data.map(d => {
                    return <Bubble price={d.price} imageUrl={d.imageUrl} size={d.size} />
                })}
            </div>

        </div>
    );
};

export default HeatBubble;
