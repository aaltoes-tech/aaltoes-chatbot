export default function UserMessage({role, content}){
    return(
        <div className="flex w-full my-2  justify-end">
            <p  className="text-left w-[75%] p-3 bg-gray-200 rounded-lg ">{content}</p>
        </div>
    )
}
