import LandingPage from '@/components/LandingPage';
import { Metadata } from 'next';
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: 'Senjr — Senior to Junior',
  description: 'Connect with verified seniors from IITs, IIMs, AIIMS, Harvard & beyond.',
};

export default async function Home() {
  const { userId } = await auth();

  return <LandingPage hasUser={!!userId} />;
}
