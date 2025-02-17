'use client';

import Background from '@/components/background';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

export default function FormComponent() {
    const [errors, setErrors] = useState<{
        email?: string[];
        dataType?: string[];
    }>({});
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});
        setResponse(null);
        setLoading(true);

        const formData = new FormData(e?.currentTarget);
        const data = {
            email: formData.get('email'),
            dataType: formData.get('dataType'),
        };

        const res = await fetch('/api/data-wanted', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await res.json();

        if (!result.success) {
            setErrors(result.errors || {});
            toast.error('Form submission failed. Check console!');
        } else {
            setResponse(result.message);
            toast.success('Your request has been submitted!');
            redirect('/');
        }
        setLoading(false);
    }

    console.log('Response:', response);
    console.log('Errors:', errors);

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="fixed inset-0 w-full h-full pointer-events-none">
                <Background />
            </div>

            <div className="max-w-lg w-full z-10 ">
                <Link href="/">
                    <div className="flex justify-start gap-2 items-center mb-8 cursor-pointer">
                        <FaArrowLeft className="text-[#00A340] text-lg" />
                        <h1 className="text-[20px] text-white">Back</h1>
                    </div>
                </Link>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 flex flex-col w-full bg-black/25 border border-green-500 p-6 rounded-lg shadow-lg"
                >
                    <h1 className="text-lg text-white">
                        Enter the type of data you want
                    </h1>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Enter Email"
                        className="w-full bg-[#D0E6AE] rounded-sm p-2"
                    />
                    <input
                        type="text"
                        name="dataType"
                        required
                        placeholder="Enter Data Type"
                        className="w-full bg-[#D0E6AE] rounded-sm p-2"
                    />

                    <Button
                        type="submit"
                        className="bg-slate-500 hover:bg-green-600 p-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Submitting' : 'Submit'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
