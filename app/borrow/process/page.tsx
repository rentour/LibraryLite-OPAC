"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Camera } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useRouter } from "next/navigation";
export const runtime = 'edge';

interface BookData {
  book_name: string;
  isbn: string;
  borrow_user: string;
  return_deadline: string;
  author?: string;
  publisher?: string;
  status?: string;
}

interface BookItem {
  bookId: string;
  bookData: BookData | null;
}

interface CameraDevice {
  id: string;
  label: string;
}

export default function Home() {
  const router = useRouter();
  const [bookItems, setBookItems] = useState<BookItem[]>([{ bookId: "", bookData: null }]);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [html5Qrcode, setHtml5Qrcode] = useState<Html5Qrcode | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  // 貸出期限を計算
  const calculateReturnDeadline = (): string => {
    const now = new Date();
    now.setDate(now.getDate() + 14); // 2週間後
    return now.toISOString().split("T")[0];
  };

  const [returnDeadline] = useState<string>(calculateReturnDeadline());

  useEffect(() => {
    setUserId(sessionStorage.getItem("user_number"));
    setOrgId(sessionStorage.getItem("org_id"));
  }, []);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            id: device.deviceId,
            label: device.label || `Camera ${devices.indexOf(device) + 1}`,
          }));
        setCameras(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].id);
        }
      } catch (error) {
        console.error("Failed to get cameras:", error);
        setError("カメラの取得に失敗しました");
        setShowErrorDialog(true);
      }
    };

    getCameras();

    const qrcode = new Html5Qrcode("reader");
    setHtml5Qrcode(qrcode);

    return () => {
      if (qrcode.isScanning) {
        qrcode.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedCamera || !html5Qrcode) return;

    const startScanner = async () => {
      if (html5Qrcode.isScanning) {
        await html5Qrcode.stop();
      }

      try {
        await html5Qrcode.start(
          { deviceId: selectedCamera },
          { fps: 10, qrbox: { width: 250, height: 100 }, aspectRatio: 1.0 },
          handleScanSuccess,
          (errorMessage: string) => handleScanError(new Error(errorMessage))
        );
      } catch (error) {
        console.error("Failed to start scanner:", error);
        setError("カメラの起動に失敗しました。");
        setShowErrorDialog(true);
      }
    };

    startScanner();
  }, [selectedCamera, html5Qrcode]);

  const handleScanSuccess = async (decodedText: string) => {
    if (html5Qrcode && html5Qrcode.isScanning) {
      await html5Qrcode.pause();
    }

    const validBooksCount = bookItems.filter((item) => item.bookId.trim() !== "").length;

    if (validBooksCount >= 3) {
      setError("一度に借りられるのは3冊までです。");
      setShowErrorDialog(true);
      if (html5Qrcode) {
        html5Qrcode.resume();
      }
      return;
    }

    await processBookId(decodedText);

    const audio = new Audio("/sounds/barcode_read.mp3");
    await audio.play();

    if (html5Qrcode) {
      html5Qrcode.resume();
    }
  };

  const handleScanError = (error: Error) => {
    if (error?.message?.includes("No QR code found")) return;
    console.warn(`Scan error:`, error);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualInput.trim()) {
      setError("IDを入力してください。");
      setShowErrorDialog(true);
      return;
    }

    await processBookId(manualInput.trim());
    setManualInput("");
  };

  const processBookId = async (bookId: string) => {
    if (bookItems.some((item) => item.bookId === bookId)) {
      setError("この本は既に追加されています。");
      setShowErrorDialog(true);
      return;
    }

    const validBooksCount = bookItems.filter((item) => item.bookId.trim() !== "").length;

    if (validBooksCount >= 3) {
      setError("一度に借りられるのは3冊までです。");
      setShowErrorDialog(true);
      return;
    }

    await handleBookLookup(bookId);
  };

  const handleBookLookup = async (bookId: string) => {
    if (!orgId) {
      setError("組織情報が見つかりません。ログインし直してください。");
      setShowErrorDialog(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_SERVER}api/books/info/${orgId}/${bookId}`
      );

      if (response.data[0]?.borrow_user) {
        setError("この本は既に貸出中です。");
        setShowErrorDialog(true);
        return;
      }

      const newBookItem = { bookId, bookData: response.data[0] };
      setBookItems((prev) => [...prev, newBookItem]);
    } catch (err) {
      setError("書籍情報の取得に失敗しました:" + err);
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!orgId || !userId) {
      setError("ユーザー情報が見つかりません。ログインし直してください。");
      setShowErrorDialog(true);
      return;
    }

    const validBooks = bookItems.filter((item) => item.bookId.trim() !== "");

    if (validBooks.length === 0) {
      setError("貸出対象の書籍がありません。");
      setShowErrorDialog(true);
      return;
    }

    setLoading(true);
    try {
      for (const item of validBooks) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_SERVER}api/books/borrow/${orgId}`,
          {
            user_number: userId,
            book_id: item.bookId,
            return_deadline: returnDeadline,
          }
        );
      }

      setBookItems([{ bookId: "", bookData: null }]);
      router.push("/complete");
    } catch (error) {
      console.error("貸出処理エラー:", error);
      setError("貸出処理に失敗しました。");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const removeBookItem = (index: number) => {
    if (bookItems.length > 1) {
      setBookItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <BookOpen className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">貸出</h1>
          </div>
          <Link href="/before">
            <Button>最初に戻る</Button>
          </Link>
        </div>
        {userId && <p>{userId}様(所属組織ID:{orgId})</p>}
        <br />

        <div className="flex gap-6">
          {/* 左側: バーコードリーダーと手動入力 */}
          <div className="w-1/2">
            <div className="mb-6">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="本のIDを入力"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  検索
                </Button>
              </form>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-4 w-4" />
                <span className="text-sm">カメラを選択</span>
              </div>
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger>
                  <SelectValue placeholder="カメラを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 border rounded bg-gray-50">
              <div id="reader"></div>
            </div>
          </div>

          {/* 右側: 登録済みの本のリスト */}
          <div className="w-1/2">
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h2 className="text-lg font-semibold mb-2">スキャン済みの本</h2>
              <p className="text-sm text-gray-600">
                {bookItems.filter((item) => item.bookId.trim() !== "").length} / 3 冊
              </p>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {bookItems.slice(1).map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">本 {index + 1}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBookItem(index + 1)}
                      >
                        削除
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <p>
                        <strong>タイトル:</strong> {item.bookData?.book_name}
                      </p>
                      <p>
                        <strong>ISBN:</strong> {item.bookData?.isbn}
                      </p>
                      {item.bookData?.author && (
                        <p>
                          <strong>著者:</strong> {item.bookData.author}
                        </p>
                      )}
                      {item.bookData?.publisher && (
                        <p>
                          <strong>出版社:</strong> {item.bookData.publisher}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Button
                disabled={bookItems.filter((item) => item.bookId.trim() !== "").length === 0 || loading}
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowConfirmDialog(true)}
              >
                貸出手続きへ進む
              </Button>
            </div>
          </div>
        </div>

        {/* エラーダイアログ */}
        <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>エラー</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* 確認ダイアログ */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>貸出確認</DialogTitle>
              <DialogDescription>
                選択された{bookItems.filter((item) => item.bookId.trim() !== "").length}冊の本を貸し出しますか？
                <br />
                返却期限: {returnDeadline}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                キャンセル
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleCheckout}
                disabled={loading}
              >
                貸出する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
