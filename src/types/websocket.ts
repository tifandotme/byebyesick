// WebSocket message response in JSON format

export type Message = {
  is_typing: boolean
  message_type: 1 | 2 // 1: alert, 2: message
  message: string
  attachment: string // base64 encoded string of an image or pdf
  created_at: string
  sender_id: number
  session_id: number
}

// Payload for sending message

export type Payload = Partial<
  Pick<Message, "is_typing" | "message" | "attachment" | "message_type">
>
