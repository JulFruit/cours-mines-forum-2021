import useSWR from 'swr'
import Message from './Message'

interface MessageApi {
    author: string
    content: string
    timestamp: number
}

const fetcher = async (url: string) => {
    let pageIndex = 0
    let messages: MessageApi[] = []
    let finished = false

    while (!finished) {
        const urlWithPage = `${url}?page=${pageIndex}`
        const response = await fetch(urlWithPage).then((response) => response.json())

        // Merge pages
        messages = messages.concat(response)

        // Increase page and finish loop if no message
        pageIndex += 1
        finished = response.length === 0
    }

    // Return messages in reverse order
    return messages.reverse()
}

const MessagesList = () => {
    const { data, error } = useSWR<MessageApi[]>('https://ensmn.herokuapp.com/messages', fetcher)

    if (error) {
        return <div>failed to load</div>
    }

    if (!data) {
        return <div>loading...</div>
    }

    return (
        <div className="container">
            {data.map(({ content, author, timestamp }, i) => <Message key={i} body={content} author={author} date={new Date(timestamp)} />)}
        </div>
    )
}

export default MessagesList
