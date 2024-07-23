"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Menu from '@/components/draw/Menu';
import Toolbox from '@/components/draw/Toolbox';
import Cam from '@/components/draw/Cam';
import styles from './page.module.css'; // Ensure to create and import your CSS module

const Page = () => {
  return (
    <Provider store={store}>
      <div className={styles.container}>
        <Cam />
        <div className={styles.menu}>
          <Menu />
        </div>
        <div className={styles.toolbox}>
          <Toolbox />
        </div>
      </div>
    </Provider>
  );
};

export default Page;
