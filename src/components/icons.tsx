import {
  AvatarIcon,
  FileIcon,
  GearIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

type IconProps = React.SVGAttributes<SVGElement>

export const Icons = {
  Logo: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      strokeWidth="0"
      stroke="currentColor"
      fill="currentColor"
      {...props}
    >
      <path d="M81.61,247.27a12,12,0,0,1-16.8,2.41A131.23,131.23,0,0,1,29.67,210a12,12,0,1,1,20.79-12,107.45,107.45,0,0,0,28.73,32.48A12,12,0,0,1,81.61,247.27ZM223.66,98A92,92,0,0,1,64.31,190l-38-65.82A32,32,0,0,1,45.46,77.33L45,76.46A32,32,0,0,1,81,29.55,31.7,31.7,0,0,1,90.62,34,32,32,0,0,1,143,38.31L155.52,60a32,32,0,0,1,50.14,6.84Zm-20.78,12-18-31.18a8,8,0,0,0-13.87,8h0l10,17.31a12,12,0,0,1-4.39,16.39,28,28,0,0,0-10.25,38.25,12,12,0,0,1-20.79,12A52.09,52.09,0,0,1,154.93,107L122.24,50.31a8,8,0,0,0-13.86,8l26,45a12,12,0,0,1-20.79,12l-34-58.89a8,8,0,0,0-10.92-2.93,8,8,0,0,0-2.93,10.93l38,65.81a12,12,0,1,1-20.79,12l-22-38.1a8,8,0,1,0-13.85,8L85.1,178a68,68,0,0,0,117.78-68ZM240.3,46.81a71.5,71.5,0,0,0-43.72-33.55,12,12,0,0,0-6.21,23.19,47.65,47.65,0,0,1,29.15,22.36,12,12,0,1,0,20.78-12Z" />
    </svg>
  ),
  Spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Product: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-pill"
      {...props}
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  ProductCategory: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-tablets"
      {...props}
    >
      <circle cx="7" cy="7" r="5" />
      <circle cx="17" cy="17" r="5" />
      <path d="M12 17h10" />
      <path d="m3.46 10.54 7.08-7.08" />
    </svg>
  ),
  CreditCard: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  File: FileIcon,
  Person: PersonIcon,
  Avatar: AvatarIcon,
  Gear: GearIcon,
  Pharmacies: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  ),
}
