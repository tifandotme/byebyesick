import React from "react"
import Link from "next/link"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types"
import { toast } from "sonner"

import type { ChatRoom, Prescription, SickLeaveForm } from "@/types/api"
import type { Payload } from "@/types/websocket"
import { alertMessages } from "@/config"
import { endChatRoom } from "@/lib/fetchers"
import { cn, formatDate } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddToCart from "@/features/consultation/components/forms/add-to-cart"
import { CertificateForm } from "@/features/consultation/components/forms/certificate"
import { PrescriptionForm } from "@/features/consultation/components/forms/prescription"

const END_CHAT_COUNTDOWN = 30

interface ConsultationSidebarProps {
  chat: ChatRoom
  as: "patient" | "doctor"
  sendJsonMessage?: SendJsonMessage
}

export const ConsultationSidebar = React.memo(function ConsultationSidebar({
  chat,
  as,
  sendJsonMessage,
}: ConsultationSidebarProps) {
  const [countdown, setCountdown] = React.useState(0)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Prescription</h3>
      <Card className="p-5">
        {chat.prescription ? (
          <>
            <h4 className="font-semibold">Symptoms</h4>
            <p className="text-sm text-muted-foreground">
              {chat.prescription.symptoms}
            </p>
            <h4 className="mt-3 font-semibold">Diagnosis</h4>
            <p className="text-sm text-muted-foreground">
              {chat.prescription.diagnosis}
            </p>
            <h4 className="mt-3 font-semibold">Medicines</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {chat.prescription.prescription_products.map((product) => (
                <li key={product.id} className="flex flex-col">
                  <span className="font-bold">{product.product.name}</span>
                  <span>Note: {product.note}</span>
                  <AddToCart {...product} />
                </li>
              ))}
            </ul>
            {as === "doctor" && (
              <EditPrescriptionDialog
                sessionId={chat.id}
                sendJsonMessage={sendJsonMessage}
                prescription={chat.prescription}
              />
            )}
            {as === "patient" && (
              <Link
                href={`/consultation/as-patient/${chat.id}/prescription`}
                target="_blank"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "mt-3 w-full",
                )}
              >
                View Perscription
                <ExternalLinkIcon className="ml-2 size-3.5" />
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              No prescription have yet been issued.
            </p>
            {as === "doctor" && (
              <AddPrescriptionDialog
                sessionId={chat.id}
                sendJsonMessage={sendJsonMessage}
              />
            )}
          </>
        )}
      </Card>
      {chat.prescription && (
        <span className="!mt-1 flex justify-end text-[0.7rem] text-muted-foreground">
          Updated at {formatDate(chat.prescription.updated_at, true)}
        </span>
      )}

      <h3 className="text-lg font-bold">Sick Leave Certificate</h3>
      <Card className="p-5">
        {chat.sick_leave_form ? (
          <>
            <h4 className="font-semibold">Date</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(chat.sick_leave_form.starting_date)} -&nbsp;
              {formatDate(chat.sick_leave_form.ending_date)}
            </p>
            <h4 className="mt-3 font-semibold">Description</h4>
            <p className="text-sm text-muted-foreground">
              {chat.sick_leave_form.description}
            </p>
            {as === "doctor" && (
              <EditCertificateDialog
                sessionId={chat.id}
                sendJsonMessage={sendJsonMessage}
                sickLeaveForm={chat.sick_leave_form}
              />
            )}
            {as === "patient" && (
              <Link
                href={`/consultation/as-patient/${chat.id}/sick-leave-certificate`}
                target="_blank"
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "mt-3 w-full",
                )}
              >
                View Certificate
                <ExternalLinkIcon className="ml-2 size-3.5" />
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              No sick leave certificate have yet been issued.
            </p>
            {as === "doctor" && (
              <AddCertificateDialog
                sessionId={chat.id}
                sendJsonMessage={sendJsonMessage}
              />
            )}
          </>
        )}
      </Card>
      {chat.sick_leave_form && (
        <span className="!mt-1 flex justify-end text-[0.7rem] text-muted-foreground">
          Updated at {formatDate(chat.sick_leave_form.updated_at, true)}
        </span>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            className="!mt-10 w-full"
            disabled={
              countdown > 0 || chat.consultation_session_status_id === 2
            }
          >
            End Chat
            {countdown > 0 && ` (00:${countdown.toString().padStart(2, "0")})`}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {as === "doctor" && (
                <>
                  <span>
                    You will have to wait for the 30 seconds countdown to end
                    for the process to complete.
                  </span>
                  <br />
                  <br />
                </>
              )}
              You will not be able to undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive !text-destructive-foreground"
              onClick={async () => {
                if (as === "doctor") {
                  for (let i = END_CHAT_COUNTDOWN; i >= 0; i--) {
                    setCountdown(i)
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                  }
                }

                const handleEndChat = async () => {
                  const { success, message } = await endChatRoom(chat.id)
                  if (!success) throw new Error(message)
                  if (sendJsonMessage) {
                    sendJsonMessage<Payload>({
                      message_type: 2,
                      message: alertMessages["chatEnded"],
                    })
                  }
                  return message
                }

                toast.promise(handleEndChat(), {
                  loading: "Ending chat room...",
                  success: (message) => message,
                  error: (err) => err.message,
                })
              }}
            >
              End Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
})

interface AddPrescriptionDialogProps {
  sessionId: number
  sendJsonMessage?: SendJsonMessage
}

export function AddPrescriptionDialog({
  sessionId,
  sendJsonMessage,
}: AddPrescriptionDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-3 w-full" size="sm">
          Issue
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sick leave certificate</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Issue a prescription to this patient
        </DialogDescription>
        <PrescriptionForm
          mode="add"
          onFormSubmit={() => {
            setOpen(false)
            if (sendJsonMessage) {
              sendJsonMessage<Payload>({
                message_type: 2,
                message: alertMessages["prescriptionIssued"],
              })
            }
          }}
          sessionId={sessionId}
        />
      </DialogContent>
    </Dialog>
  )
}

interface EditPrescriptionDialogProps {
  sessionId: number
  sendJsonMessage?: SendJsonMessage
  prescription: Prescription
}

export function EditPrescriptionDialog({
  sessionId,
  sendJsonMessage: sendJsonMessage,
  prescription,
}: EditPrescriptionDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-3 w-full" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Prescription</DialogTitle>
          <DialogDescription>
            Edit the prescription issued to this patient
          </DialogDescription>
        </DialogHeader>
        <PrescriptionForm
          mode="edit"
          sessionId={sessionId}
          onFormSubmit={() => {
            setOpen(false)
            if (sendJsonMessage) {
              sendJsonMessage<Payload>({
                message_type: 2,
                message: alertMessages["prescriptionUpdated"],
              })
            }
          }}
          initialData={prescription}
        />
      </DialogContent>
    </Dialog>
  )
}

interface AddCertificateDialogProps {
  sessionId: number
  sendJsonMessage?: SendJsonMessage
}

export function AddCertificateDialog({
  sessionId,
  sendJsonMessage,
}: AddCertificateDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-3 w-full" size="sm">
          Issue
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sick leave certificate</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Issue a sick leave certificate to this patient
        </DialogDescription>
        <CertificateForm
          mode="add"
          onFormSubmit={() => {
            setOpen(false)
            if (sendJsonMessage) {
              sendJsonMessage<Payload>({
                message_type: 2,
                message: alertMessages["sickLeaveIssued"],
              })
            }
          }}
          sessionId={sessionId}
        />
      </DialogContent>
    </Dialog>
  )
}

interface EditCertificateDialogProps {
  sessionId: number
  sendJsonMessage?: SendJsonMessage
  sickLeaveForm: Omit<SickLeaveForm, "prescription" | "user" | "doctor">
}

export function EditCertificateDialog({
  sessionId,
  sendJsonMessage: sendJsonMessage,
  sickLeaveForm,
}: EditCertificateDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-3 w-full" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sick leave certificate</DialogTitle>
          <DialogDescription>
            Edit the sick leave certificate issued to this patient
          </DialogDescription>
        </DialogHeader>
        <CertificateForm
          mode="edit"
          sessionId={sessionId}
          onFormSubmit={() => {
            setOpen(false)
            if (sendJsonMessage) {
              sendJsonMessage<Payload>({
                message_type: 2,
                message: alertMessages["sickLeaveUpdated"],
              })
            }
          }}
          initialData={sickLeaveForm}
        />
      </DialogContent>
    </Dialog>
  )
}
