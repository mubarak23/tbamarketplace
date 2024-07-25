import React from 'react';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='px-20 py-10'>
       <Toaster />
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
