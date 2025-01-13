"use client"
import { Button } from "../../components/ui/button";
import {useRouter} from 'next/navigation'
import { signIn, useSession } from "next-auth/react";
import cuid from 'cuid';

import Link from "next/link";

function WelcomeInput() {
    const router = useRouter()

    const session = useSession();
    const user = session.data?.user;
    return (
        <>
            <h1 >Welcome</h1>
            <Link href={`/chat/${cuid()}`}><Button>Start conversation</Button></Link>
        </>
    );
}

export default WelcomeInput;
