import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Detox Digital 7 Dias",
    description: "Reduza o uso do celular em 7 dias.",
};

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen pb-20">
            <main className="max-w-md mx-auto min-h-screen relative">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
