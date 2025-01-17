"use client"
import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen} from 'lucide-react';
import QrcodeReader from '@/components/QrcodeReader';
import Loading from '../loading';
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import Link from 'next/link';


export default function Home() {
  const [scannedTime, setScannedTime] = useState(new Date());
  const [scannedResult, setScannedResult] = useState('');
  const [org_id, setorg_id] = useState('');
  const [user_number, setuser_number] = useState('');
  const [isScanned, setisScanned] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const manual_confirm = () => {
    setShowLoginDialog(false)
    setisScanned(true)

    sessionStorage.setItem("org_id", org_id)
    sessionStorage.setItem("user_number", user_number)
    redirect("/borrow/confirm")
  }

  const onNewScanResult = (result: any) => {
    console.log('QRコードスキャン結果');
    console.log(result);
    setScannedTime(new Date());
    setScannedResult(result);
    setisScanned(true);

    sessionStorage.setItem("org_id", org_id)
    sessionStorage.setItem("user_number", user_number)
    redirect("/borrow/confirm")

  }

  useEffect(() => {}, [scannedTime, scannedResult]);

  if (isScanned){
    return (
      <>
      <Loading />
      </>
    )
  }

  return (
   <>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>手動入力</DialogTitle>
            <DialogDescription>
              <p>組織ID:</p>
              <Input required onChange={(e) => setorg_id(e.target.value)} />
              <p>利用者番号(ID):</p>
              <Input required onChange={(e) => setuser_number(e.target.value)} />
              <Button onClick={() => manual_confirm()}>手動入力で処理に進む</Button>

            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
          利用者カードに記載のOPAC用利用者QRコードを読み込ませてください<br />
          お持ちでない場合は手動入力を押してください
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
        <QrcodeReader
        onScanSuccess={onNewScanResult}
        onScanFailure={(error : string) => {
          console.log(error)
        }}
      />
      <br />
        </div>
        <Button onClick={() => setShowLoginDialog(true)}>手動入力</Button>

      </div>
    </div>


   </>
  );
}
