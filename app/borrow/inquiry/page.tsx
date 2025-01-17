"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import { RotatingLines } from 'react-loader-spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export const runtime = 'edge';

interface Users {
    user_number: string;
    Name: string;
    Name_Yomi: string;
    Adress: string;
    Email: string;
    Cell_Number: string;
    BirthDate: string;
}

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<Users | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER}api/user/info/${sessionStorage.getItem("org_id")}/${sessionStorage.getItem("user_number")}`
                );
                setUserData(response.data[0]);
                console.log(response.data[0])
            } catch (err) {
                setError("利用者情報の取得に失敗しました。");
                console.error("Error fetching user data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, []);

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
                        <Link href="/before">
                            <Button>最初に戻る</Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center">
                            <div className="flex justify-center items-center">
                                <RotatingLines width="300" />
                            </div>
                            <p className="text-center text-3xl mt-4">
                                情報照会中です しばらくお待ち下さい
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600">
                            <p className="text-xl">{error}</p>
                        </div>
                    ) : userData ? (
                        <>
                        <p>下記の情報が貴方様の情報でよろしければ確認を</p>
                        <p>異なる方の情報が表示された場合は訂正を押してください</p>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-gray-600">利用者番号(ID)</p>
                                    <p className="text-xl">{userData.user_number}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-gray-600">氏名</p>
                                    <p className="text-xl">{userData.Name}({userData.Name_Yomi})</p>
                                </div>
                            </div>
                        </div>
                        <div className='gap-5'>
                        <Link href="/borrow/process"><Button>確認</Button></Link>
                        <Link href="/before"><Button>訂正</Button></Link>
                        </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
}