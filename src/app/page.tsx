import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-red-200 via-purple-100 to-violet-400">
      <div className="flex justify-end p-4 ">
        <div className="rounded-xl bg-white/60 p-2">
          <UserButton afterSignOutUrl="/" showName />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">PDF IntelliQuery</h1>
          </div>
          <div className="flex mt-3">
            {isAuth && <Button>Go to Chats</Button>}
          </div>
          <p className="text-lg text-slate-600 mt-1 max-w-xl">
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
