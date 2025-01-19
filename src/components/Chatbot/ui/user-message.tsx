export default function UserMessage({role, content}: {role: string, content: string}){
    return(
        <div className="flex w-full my-2 justify-end">
            <p className="text-left w-[60%] p-3 bg-muted rounded-lg text-base leading-relaxed">
                {content}
            </p>
        </div>
    )
}
