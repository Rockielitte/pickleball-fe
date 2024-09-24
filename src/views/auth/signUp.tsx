'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { UserAuthForm } from '@/components/AuthForm';
import SignUpRoleSelect from '@/components/SignUpRoleSelect';
import banner from '@/public/assets/images/resbg.webp';
import { RoleEnum } from '@/types';

const SignUp = () => {
  const [role, setRole] = React.useState<RoleEnum.CUSTOMER | RoleEnum.MANAGER>(
    RoleEnum.CUSTOMER
  );
  return (
    <div className='container relative grid h-full min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute right-0 top-0'>
        <SignUpRoleSelect role={role} setRole={setRole} />
      </div>
      <div className='relative hidden h-full flex-col rounded-md    font-bold text-white dark:border-r lg:flex'>
        <div className='absolute inset-0  flex size-full items-center justify-center rounded-md '>
          <Image
            className=' h-[90%] object-contain '
            alt='badminton banner'
            src={banner}
          />
        </div>
      </div>
      <div
        className='relative
      lg:p-8
      '
      >
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            {/* <div className="relative z-20 flex items-center justify-center  text-2xl font-semibold">
              <Image src={logo} alt="badminton" width={40} />
              badminton
            </div> */}
            <h1 className='text-2xl font-semibold tracking-tight'>
              Create an account
            </h1>
            <span className='text-sm text-muted-foreground'>
              Complete our form below to create your account
            </span>
          </div>
          <UserAuthForm type='sign-up' role={role} />
          <span className='px-8 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </Link>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
