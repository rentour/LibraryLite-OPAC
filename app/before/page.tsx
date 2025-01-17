"use client"
import { LibraryBig } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {

    const DeleteData = () => {
        sessionStorage.clear();
    }
    DeleteData()

    return (
        <>
            <div className="bg-gray-100 p-4">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-600 p-2 rounded-lg">
                            <LibraryBig className="text-white h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-bold">ご案内</h1>
                        </div>
                    </div>
                    <p>お手数ですが、最初からやり直してください。</p>
                    <Link href="/"><Button>はじめに戻る</Button></Link>
                </div>
            </div>
        </>
    );
}