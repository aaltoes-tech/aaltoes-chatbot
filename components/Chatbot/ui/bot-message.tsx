export default function BotMessage({role, content}: {role: string, content: string}){
    return(
            <div className="flex w-full p-3 my-2">
                <div className="text-left w-[75%] p-3 bg-gray-100 rounded-lg whitespace-pre-wrap">
                    {content}
                </div>
            </div>

            
        )
}
