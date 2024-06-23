import FileUpload from "@/components/FileUpload";
import GoToChats from "@/components/GoToChats";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen animate-gradient-x sm:bg-gradient-to-r sm:from-red-200 sm:via-purple-100 sm:to-violet-400 ">
      {isAuth && (
        <div className="flex justify-end p-4 ">
          <div className="p-2 rounded-xl bg-white/60">
            <UserButton afterSignOutUrl="/" showName />
          </div>
        </div>
      )}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">PDF IntelliQuery</h1>
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800 sm:text-3xl">
            (AI powered pdf summarization/query web application)
          </h2>
          <GoToChats auth={isAuth} />
          <p className="max-w-xl mt-2 text-lg text-slate-600">
            Join millions of students, researchers and professionals who use PDF
            IntelliQuery to get more done, faster.
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href={"/sign-in"}>
                <Button>
                  Login to get Started <LogIn className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
