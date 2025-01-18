export default function BotMessage({role, content}: {role: string, content: string}){
    return(
        
        <div className="flex w-full p-3 my-2">
            <p>{content}</p>
        </div>
       
    )
}
