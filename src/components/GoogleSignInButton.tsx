/* eslint-disable @next/next/no-img-element */
import { FC, ReactNode } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => signIn('google',{callbackUrl:'https://freehanddraw.com/board'})
  return (
    <Button onClick={loginWithGoogle} className='w-full bg-blue-800 rounded-xl flex items-center justify-center'>
      <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google Logo"
              className="h-5 w-5 mr-2"
            />
      {children}
    </Button>
  );
};
export default GoogleSignInButton;