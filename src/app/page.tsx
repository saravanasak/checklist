import ChecklistForm from '@/components/ChecklistForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <Image
            src="/logo.svg"
            alt="Genesys Logo"
            width={180}
            height={40}
            priority
          />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-[#FF4F1F] text-white">
            <h1 className="text-2xl font-bold">Employee 1st Day Checklist</h1>
            <p className="mt-2">Please complete all items on this checklist to ensure a smooth onboarding process.</p>
          </div>
          
          <ChecklistForm />
        </div>
      </main>
      
      <footer className="bg-[#0F1941] text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Genesys. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
