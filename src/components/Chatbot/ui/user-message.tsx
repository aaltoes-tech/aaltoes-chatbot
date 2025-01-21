export default function UserMessage({role, content}: {role: string, content: string}){
    return(
        <div className="flex  text-left  text-foreground  justify-end">
            <div className="text-left w-[60%] p-3 text-base leading-relaxed bg-muted rounded-lg">
                <p className="text-ellipsis overflow-hidden truncate...">{content}</p>
            </div>
        </div>
    )
}
