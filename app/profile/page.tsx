import { currentUser } from "@clerk/nextjs/server"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { formatDate, formatTimeAgo } from "../../_lib/utils"

const Page = async () => {
    const user = await currentUser()

    console.log('Current User:', user)

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <div className="relative w-60 h-60 mb-4 flex justify-center items-center">
                <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-400/30 via-purple-500/30 to-pink-500/30 backdrop-blur-md border border-white/30 shadow-lg animate-pulse z-0 bg-[length:200%_200%] animate-gradient" style={{ animationDuration: '3s' }}></div>
                {/* <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 animate-pulse z-0 blur-sm" style={{ animationDuration: '3s' }}></div> */}
                <Avatar className="w-50 h-50 z-10">
                    <AvatarImage src={user?.imageUrl} alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
            <h1 className="text-2xl font-bold mb-4 font-mono text-primary">{user?.fullName}</h1>
            {/* <p>User ID: {user?.id}</p> */}
            <p className="lowercase font-mono font-bold text-muted-foreground">Email: {user?.primaryEmailAddress?.emailAddress}</p>
            <p className="lowercase font-mono font-bold text-muted-foreground">Created At: {formatDate(user?.createdAt)}</p>
            <p className="lowercase font-mono font-bold text-muted-foreground">Last Active: {formatTimeAgo(user?.lastActiveAt!)}</p>
        </div>
    )
}



export default Page