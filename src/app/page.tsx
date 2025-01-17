"use client";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
    const { ready, authenticated, login } = usePrivy();

    const LoginButton = () => {
        if (ready && !authenticated) {
            return <Button onClick={login}>Start Your Journey</Button>;
        }
    };

    return (
        <div>
            <LoginButton />
        </div>
    );
}
