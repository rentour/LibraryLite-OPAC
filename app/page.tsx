"use client"
import { Button } from '@/components/ui/button';
import { BookOpen, BookX, Search, Clock, LibraryBig } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
   <>
   <div className="bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <LibraryBig className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">LibraryLite 館内向けOPAC(共通)</h1>
          </div>
        </div>

        <div className="text-sm mb-4">
          ご利用になるサービスを 画面の □ に触れて 選択してください
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Link href="/borrow" className="block">
            <Button 
              className="w-full h-24 text-xl font-bold bg-green-100 hover:bg-green-200 text-green-900"
            >
              <BookOpen className="mr-2 h-6 w-6" />
              貸出
            </Button>
          </Link>

          <Link href="/return" className="block">
            <Button 
              className="w-full h-24 text-xl font-bold bg-green-100 hover:bg-green-200 text-green-900"
            >
              <BookX className="mr-2 h-6 w-6" />
              返却
            </Button>
          </Link>

          <Link href="/reserve" className="block">
            <Button 
              className="w-full h-24 text-xl font-bold bg-green-100 hover:bg-green-200 text-green-900"
            >
              <Clock className="mr-2 h-6 w-6" />
              予約
            </Button>
          </Link>

          <Link href="/search" className="block">
            <Button 
              className="w-full h-24 text-xl font-bold bg-green-100 hover:bg-green-200 text-green-900"
            >
              <Search className="mr-2 h-6 w-6" />
              蔵書検索
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link href="/history" className="block">
            <Button 
              variant="outline"
              className="w-full h-16 text-lg"
            >
              貸出履歴
            </Button>
          </Link>

          <Link href="/extend" className="block">
            <Button 
              variant="outline"
              className="w-full h-16 text-lg"
            >
              延長手続
            </Button>
          </Link>

          <Link href="/new-books" className="block">
            <Button 
              variant="outline"
              className="w-full h-16 text-lg"
            >
              新着図書
            </Button>
          </Link>

          <Link href="/events" className="block">
            <Button 
              variant="outline"
              className="w-full h-16 text-lg"
            >
              イベント情報
            </Button>
          </Link>

          <Link href="/calendar" className="block">
            <Button 
              variant="outline"
              className="w-full h-16 text-lg"
            >
              開館カレンダー
            </Button>
          </Link>

          <Link href="/guide" className="block">
            <Button 
              variant="outline"
              className="w-full h-16 text-lg"
            >
              利用案内
            </Button>
          </Link>
        </div>
      </div>
    </div>
   </>
  );
}