"use client"
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  return (
   <>

  <div className="bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <BookOpen className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">貸出</h1>
          </div>
        </div>

        <div className="text-sm mb-4">
          <h1 className='text-3xl text-center'>貸出処理が完了しました。</h1>
        </div>

        <div className="text-center">
        <p>先程の画面で表示された返却期限を厳守してください。</p>
        </div>
        <div className='flex justify-center items-center'>
        <Link href="/"><Button>トップに戻る</Button></Link>
        </div>
      </div>
    </div>
   </>
  );
}
