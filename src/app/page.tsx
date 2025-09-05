import { redirect } from "next/navigation";
import { Suspense } from "react";
import React from 'react';
import { getSession } from "@/lib/auth";

import { LandingPageContents } from "./_ui/landing-page-contents";


const LandingPage = async  () => {
    const session = await getSession();

    if(session) redirect("/home");

    return (
        <div>
            <LandingPageContents/>
        </div>
    );
};

export default LandingPage;