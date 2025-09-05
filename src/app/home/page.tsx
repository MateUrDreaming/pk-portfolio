import React from 'react';
import {HomePageContents} from "@/app/home/_ui/home-page-contents";
import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";

const HomePage = async () => {
    const session = await getSession();

    if(!session) redirect("/login");

    return (
        <div>
            This is the home page
            <HomePageContents/>
        </div>
    );
};

export default HomePage;