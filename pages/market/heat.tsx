import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';

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
                <Bubble />
            </div>

        </div>
    );
};

export default HeatBubble;
