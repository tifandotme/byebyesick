import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronLeftIcon,
  Cross2Icon,
  FileIcon,
  HamburgerMenuIcon,
  ImageIcon,
} from "@radix-ui/react-icons"
import imageCompression from "browser-image-compression"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { toast } from "sonner"
import useSWR from "swr"

import type { chatRoomInputs } from "@/types"
import { type ChatRoom, type ResponseById } from "@/types/api"
import type { Message, Payload } from "@/types/websocket"
import { alertMessages } from "@/config"
import { blobToFile, cn, fileToBase64, formatDateChat } from "@/lib/utils"
import { chatRoomSchema } from "@/lib/validations/consultation"
import { useIsTyping } from "@/hooks/use-is-typing"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { MainLayout } from "@/components/layouts/main"
import { OnlineStatus } from "@/features/consultation/components/online-status"
import { PdfPreview } from "@/features/consultation/components/pdf-preview"
import { ConsultationSidebar } from "@/features/consultation/components/sidebar"

export const getServerSideProps: GetServerSideProps<{
  sessionId: string
  defaultLayout: [number, number] | []
}> = async (context) => {
  const layout = context.req.cookies["react-resizable-panels:layout"]

  const sessionId = context.params?.sessionId
  if (!sessionId || isNaN(Number(sessionId))) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      sessionId,
      defaultLayout: layout ? JSON.parse(layout) : [],
    },
  }
}

export default function PatientChatRoomPage({
  sessionId,
  defaultLayout,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()

  const submitEl = React.useRef<HTMLButtonElement | null>(null)
  const listEl = React.useRef<HTMLUListElement | null>(null)

  const [isTyping, register] = useIsTyping({ timeout: 1500 })
  const [isOpponentTyping, setIsOpponentTyping] = React.useState(false)
  const [messageHistory, setMessageHistory] = React.useState<Message[]>([])

  const { data, isLoading, mutate } = useSWR<ResponseById<ChatRoom>>(
    `/v1/chats/${sessionId}`,
    {
      onSuccess: (data) => {
        if (!data) return
        // Set initial message history
        setMessageHistory((prev) => {
          if (prev.length) return prev
          return data.data.messages.filter(
            ({ message, attachment }) => message.length || attachment.length,
          )
        })
      },
    },
  )

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<Message>(
      session?.user.token
        ? `${process.env.NEXT_PUBLIC_WS_URL as string}/v1/chats/${sessionId}/join`
        : null,
      {
        queryParams: session?.user.token
          ? {
              token: session.user.token,
            }
          : undefined,
      },
      data?.data.consultation_session_status_id === 1,
    )

  React.useEffect(() => {
    const connectionStatus = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Open",
      [ReadyState.CLOSING]: "Closing",
      [ReadyState.CLOSED]: "Closed",
      [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState]

    console.log("WS connection status: ", connectionStatus)
  }, [readyState])

  // #region Form
  const form = useForm<chatRoomInputs>({
    resolver: zodResolver(chatRoomSchema),
    defaultValues: {
      message: "",
      image: "",
      pdf: "",
    },
  })

  const onSubmit = async (data: chatRoomInputs) => {
    if (data.image) {
      const image = await fetch(data.image).then((res) => res.blob())
      const compressedImage = await imageCompression(
        blobToFile(image, "image"),
        {
          maxSizeMB: 0.5,
        },
      )
      const base64Image = await fileToBase64(compressedImage)

      sendJsonMessage<Payload>({
        message: data.message,
        message_type: 1,
        attachment: base64Image,
      })
    } else if (data.pdf) {
      const pdf = await fetch(data.pdf).then((res) => res.blob())
      const base64Pdf = await fileToBase64(blobToFile(pdf, "pdf"))

      sendJsonMessage<Payload>({
        message: data.message,
        message_type: 1,
        attachment: base64Pdf,
      })
    } else {
      sendJsonMessage<Payload>({
        message: data.message,
        message_type: 1,
      })
    }

    form.reset()
  }
  // #endregion

  // Add new message to message history & and mutate on certain alerts
  React.useEffect(() => {
    if (!lastJsonMessage) return
    if (!lastJsonMessage.message && !lastJsonMessage.attachment) return

    if (
      lastJsonMessage.message_type === 2 &&
      (
        [
          alertMessages["prescriptionUpdated"],
          alertMessages["prescriptionIssued"],
          alertMessages["sickLeaveIssued"],
          alertMessages["sickLeaveUpdated"],
          alertMessages["chatEnded"],
        ] as string[]
      ).includes(lastJsonMessage.message)
    ) {
      mutate()
    }

    setMessageHistory((prev) => prev.concat(lastJsonMessage))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage])

  // Send typing status
  React.useEffect(() => {
    sendJsonMessage<Payload>({ is_typing: isTyping })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping])

  // Receive opponent typing status
  React.useEffect(() => {
    if (!lastJsonMessage) return
    if (lastJsonMessage.sender_id === data?.data.user_id) return
    if (lastJsonMessage.message || lastJsonMessage.attachment) return
    setIsOpponentTyping(lastJsonMessage.is_typing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage])

  // Show error toast on form error
  React.useEffect(() => {
    if (!form.formState.errors.message) return
    toast.error(form.formState.errors.message.message)
  }, [form.formState.errors])

  // Scroll to bottom on every new message
  React.useEffect(() => {
    listEl.current?.lastElementChild?.scrollIntoView({
      behavior: "instant",
      block: "start",
    })
  }, [messageHistory])

  return (
    <div className="container flex h-[calc(100vh-5rem-1px)] max-w-screen-lg items-start gap-8 !px-0 sm:!px-14 lg:grid lg:max-w-screen-xl lg:grid-cols-12">
      <section className="col-span-8 flex size-full flex-col justify-stretch border-x">
        <header className="relative flex h-full max-h-[80px] items-center gap-4 border-b p-3">
          <div className="absolute left-0 top-0 flex h-[80px] translate-x-[-50px] items-center">
            <Link
              href="/consultation/as-patient"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-9 rounded-md",
              )}
            >
              <ChevronLeftIcon className="size-4" />
            </Link>
          </div>
          <Avatar className="size-12 rounded-full bg-muted">
            <AvatarImage
              src={data?.data.doctor.profile_photo ?? undefined}
              alt={session?.user.name}
            />
            {data?.data.doctor.name ? (
              <AvatarFallback>
                {data.data.doctor.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            ) : (
              <Icons.Person className="m-auto size-10 p-2 text-muted-foreground" />
            )}
          </Avatar>
          {data ? (
            <div className="space-y-0.5">
              <div className="font-semibold leading-none">
                {data?.data.doctor.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {isOpponentTyping && "Typing..."}
              </div>
              <div
                className={cn(
                  "text-sm text-muted-foreground",
                  isOpponentTyping && "hidden",
                )}
              >
                <OnlineStatus doctorId={data.data.doctor_id} textOnly />
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="absolute inset-x-auto right-4 flex lg:hidden"
              >
                <HamburgerMenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full overflow-y-auto py-4 xs:max-w-sm"
            >
              {data && (
                <ConsultationSidebar
                  chat={data.data}
                  as="patient"
                  sendJsonMessage={
                    data.data.consultation_session_status_id === 1
                      ? sendJsonMessage
                      : undefined
                  }
                />
              )}
            </SheetContent>
          </Sheet>
        </header>
        <Form {...form}>
          <form className="size-full" onSubmit={form.handleSubmit(onSubmit)}>
            <ResizablePanelGroup
              onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
              }}
              direction="vertical"
            >
              <ResizablePanel
                defaultSize={defaultLayout[0]}
                className="flex flex-col"
              >
                <ScrollArea className="h-full overflow-x-hidden">
                  {isLoading && !data && (
                    <ul className="space-y-4 p-4">
                      <Skeleton className="ml-auto h-9 w-44 rounded-lg" />
                      <Skeleton className="ml-auto h-9 w-28 rounded-lg" />
                      <Skeleton className="h-9 w-28 rounded-lg" />
                      <Skeleton className="h-9 w-32 rounded-lg" />
                    </ul>
                  )}
                  {data && (
                    <ul className="space-y-4 p-4" ref={listEl}>
                      {messageHistory.map((message, idx) => {
                        const isUser = message.sender_id === data.data.user_id
                        return (
                          <li
                            key={idx}
                            className={cn(
                              "flex items-end gap-2",
                              isUser && "flex-row-reverse",
                            )}
                          >
                            {message.message_type == 1 ? (
                              <>
                                <div
                                  className={cn(
                                    "flex w-fit max-w-full flex-col rounded-lg xs:max-w-[75%]",
                                    isUser
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted",
                                  )}
                                >
                                  {message.attachment &&
                                    (() => {
                                      if (message.attachment.includes("pdf")) {
                                        return (
                                          <PdfPreview
                                            src={message.attachment}
                                            className={cn(
                                              isUser
                                                ? "text-muted hover:text-muted/80"
                                                : "text-foreground hover:text-foreground/80",
                                            )}
                                          />
                                        )
                                      }

                                      return (
                                        <Image
                                          className={cn(
                                            "size-full max-w-[200px] rounded-lg p-1 xs:max-w-[300px]",
                                            message.message && "pb-0",
                                          )}
                                          src={message.attachment}
                                          height={300}
                                          width={300}
                                          onLoad={() => {
                                            listEl.current?.lastElementChild?.scrollIntoView(
                                              {
                                                behavior: "instant",
                                                block: "start",
                                              },
                                            )
                                          }}
                                          alt="Attachment"
                                          loading="eager"
                                        />
                                      )
                                    })()}
                                  {message.message && (
                                    <span className="whitespace-break-spaces px-3 py-2 text-sm">
                                      {message.message}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "whitespace-nowrap text-[10px] text-muted-foreground",
                                  )}
                                >
                                  {formatDateChat(message.created_at)}
                                </span>
                              </>
                            ) : (
                              <div className="mx-auto w-fit whitespace-break-spaces text-balance text-center text-sm italic text-muted-foreground">
                                {message.message}
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </ScrollArea>
                {form.watch("image") && (
                  <div className="relative flex h-[200px] w-full flex-col items-center justify-center border-t bg-muted p-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 z-10 size-8 bg-muted"
                      onClick={() => {
                        const image = form.getValues("image")
                        if (image) URL.revokeObjectURL(image)
                        form.setValue("image", "")
                      }}
                    >
                      <Cross2Icon className="size-4" />
                    </Button>
                    <Image
                      className="h-full w-fit rounded-md object-contain"
                      src={form.getValues("image") ?? ""}
                      width={200}
                      height={200}
                      alt="Attached image"
                      sizes="(max-width: 900px) 90vw, 50vw"
                    />
                  </div>
                )}
                {form.watch("pdf") && (
                  <div className="relative flex h-[200px] w-full flex-col items-center justify-center border-t bg-muted p-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 z-10 size-8 bg-muted"
                      onClick={() => {
                        const pdf = form.getValues("pdf")
                        if (pdf) URL.revokeObjectURL(pdf)
                        form.setValue("pdf", "")
                      }}
                    >
                      <Cross2Icon className="size-4" />
                    </Button>
                    {form.getValues("pdf") && (
                      <PdfPreview src={form.getValues("pdf")} />
                    )}
                  </div>
                )}
              </ResizablePanel>
              <ResizableHandle className="border-t bg-background py-[3px]" />
              <ResizablePanel
                defaultSize={defaultLayout[1] ?? 20}
                minSize={18}
                maxSize={40}
              >
                <div className="relative flex size-full flex-col items-center">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <Textarea
                        className="m-0 size-full min-h-4 rounded-none border-0 p-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                        style={{ resize: "none" }}
                        onKeyDown={(e) => {
                          const target = e.target as HTMLTextAreaElement
                          // JS natively supports shift + enter for a new line, but not ctrl + enter
                          if (e.ctrlKey && e.key === "Enter") {
                            target.value += "\n"
                            return
                          }
                          if (!e.shiftKey && e.key === "Enter") {
                            e.preventDefault()
                            target.value = target.value.trim()
                            submitEl.current?.click()
                          }
                        }}
                        {...field}
                        ref={register}
                      />
                    )}
                  />
                  <div className="flex h-fit w-full items-center justify-between p-3">
                    <div className="flex items-center gap-1">
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <label
                            className={cn(
                              data?.data.consultation_session_status_id !== 1 &&
                                "pointer-events-none opacity-50",
                            )}
                          >
                            <Input
                              className="hidden"
                              type="file"
                              onChange={(e) => {
                                const files = e.target.files
                                if (!files) return

                                const file = files[0]
                                if (!file) return

                                field.onChange(URL.createObjectURL(file))
                                form.setValue("pdf", "")
                              }}
                              accept="image/*"
                            />
                            <div
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "cursor-pointer p-3",
                              )}
                            >
                              <ImageIcon className="size-5" />
                              <span className="ml-1 hidden md:inline-block">
                                Attach an image
                              </span>
                            </div>
                          </label>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pdf"
                        render={({ field }) => (
                          <label
                            className={cn(
                              data?.data.consultation_session_status_id !== 1 &&
                                "pointer-events-none opacity-50",
                            )}
                          >
                            <Input
                              className="hidden"
                              type="file"
                              onChange={(e) => {
                                const files = e.target.files
                                if (!files) return

                                const file = files[0]
                                if (!file) return

                                field.onChange(URL.createObjectURL(file))
                                form.setValue("image", "")
                              }}
                              accept="application/pdf"
                            />
                            <div
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "cursor-pointer p-3",
                              )}
                            >
                              <FileIcon className="size-5" />
                              <span className="ml-1 hidden md:inline-block">
                                Attach a PDF
                              </span>
                            </div>
                          </label>
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="hidden select-none text-sm text-muted-foreground sm:inline-block">
                        Press Ctrl + Enter for a new line
                      </span>
                      <Button
                        ref={submitEl}
                        disabled={
                          readyState !== ReadyState.OPEN ||
                          form.formState.isSubmitting
                        }
                        type="submit"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </form>
        </Form>
      </section>

      <aside className="col-span-4 hidden size-full overflow-y-auto py-4 lg:block">
        {data && (
          <ConsultationSidebar
            chat={data.data}
            as="patient"
            sendJsonMessage={
              data.data.consultation_session_status_id === 1
                ? sendJsonMessage
                : undefined
            }
          />
        )}
      </aside>
    </div>
  )
}

PatientChatRoomPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout includeFooter={false}>{page}</MainLayout>
}
