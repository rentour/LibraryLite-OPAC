"use client"
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
export const runtime = 'edge';

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
          <Link href="/before"><Button>最初に戻る</Button></Link>
        </div>

        <div className="text-sm mb-4">
          以下の内容でよろしければ確認を<br />
          訂正する場合は訂正を押してください
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
        <p>組織ID:{sessionStorage.getItem("org_id")}</p><br />
        <p>利用者番号(ID):{sessionStorage.getItem("user_number")}</p>
        </div>
        <div className='gap-5'>
        <Link href="/borrow/inquiry"><Button>確認</Button></Link> <Link href="/borrow/"><Button>訂正</Button></Link>
        </div>
      </div>
    </div>
   </>
  );
}
