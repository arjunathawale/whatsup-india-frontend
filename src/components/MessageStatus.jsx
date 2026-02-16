import { BsCheck, BsCheck2All, BsClock } from "react-icons/bs"
import { FcCancel } from "react-icons/fc"

const MessageStatus = ({messageStatus}) => {
    return (
        <span>
            {
                messageStatus === "pending" && <BsClock className='h-3 w-3 text-gray-600 flex justify-center items-center' />
            }
            {
                messageStatus === "sent" && <BsCheck className='h-4 w-4 text-gray-600 flex justify-center items-center' />
            }
            {
                messageStatus === "delivered" && <BsCheck2All className='h-4 w-4 text-gray-600 flex justify-center items-center' />
            }
            {
                messageStatus === "read" && <BsCheck2All className='h-4 w-4 text-blue-500 flex justify-center items-center' />
            }
            {
                messageStatus === "failed" && <FcCancel className='h-4 w-4 text-blue-500 flex justify-center items-center' />
            }
        </span>
    )
}

export default MessageStatus