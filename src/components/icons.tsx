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
      viewBox="14.4283 12.82 298.7985 227.2759"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#8aed08"
        d="M 195.5,54.5 C 195.5,55.1667 195.5,55.8333 195.5,56.5C 160.437,55.2704 138.604,71.6038 130,105.5C 129.333,133.833 129.333,162.167 130,190.5C 130.505,192.518 131.005,194.518 131.5,196.5C 106.781,196.961 82.1148,196.461 57.5,195C 25.4773,183.487 11.3106,160.654 15,126.5C 24.9405,93.7626 47.1071,78.0959 81.5,79.5C 79.9254,43.4396 96.592,21.2729 131.5,13C 163.316,11.0539 184.649,24.8873 195.5,54.5 Z"
      />
      <path
        fill="#04e27f"
        d="M 195.5,56.5 C 216.167,56.5 236.833,56.5 257.5,56.5C 287.571,59.7777 306.071,76.1111 313,105.5C 315.298,139.767 300.131,161.934 267.5,172C 260.555,173.23 253.555,173.73 246.5,173.5C 248.281,199.439 238.281,219.272 216.5,233C 185.863,246.715 160.029,240.549 139,214.5C 135.426,208.945 132.926,202.945 131.5,196.5C 157.107,197.78 176.94,187.78 191,166.5C 193.918,160.172 195.918,153.505 197,146.5C 197.667,117.833 197.667,89.1667 197,60.5C 196.59,59.0993 196.09,57.766 195.5,56.5 Z"
      />
      <path
        fill="#009673"
        d="M 195.5,56.5 C 196.09,57.766 196.59,59.0993 197,60.5C 197.667,89.1667 197.667,117.833 197,146.5C 195.918,153.505 193.918,160.172 191,166.5C 176.94,187.78 157.107,197.78 131.5,196.5C 131.005,194.518 130.505,192.518 130,190.5C 129.333,162.167 129.333,133.833 130,105.5C 138.604,71.6038 160.437,55.2704 195.5,56.5 Z"
      />
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
