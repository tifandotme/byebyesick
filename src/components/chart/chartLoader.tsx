import React from "react"

function ChartLoader() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: "auto",
        background: "rgb(241, 242, 243)",
        display: "block",
        shapeRendering: "auto",
      }}
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="translate(26.666666666666668,26.666666666666668)">
        <rect x={-20} y={-20} width={40} height={40} fill="#7ee752">
          <animateTransform
            attributeName="transform"
            type="scale"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="1.1500000000000001;1"
            begin="-0.3s"
          />
        </rect>
      </g>
      <g transform="translate(73.33333333333333,26.666666666666668)">
        <rect x={-20} y={-20} width={40} height={40} fill="#55ecb5">
          <animateTransform
            attributeName="transform"
            type="scale"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="1.1500000000000001;1"
            begin="-0.2s"
          />
        </rect>
      </g>
      <g transform="translate(26.666666666666668,73.33333333333333)">
        <rect x={-20} y={-20} width={40} height={40} fill="#239e9e">
          <animateTransform
            attributeName="transform"
            type="scale"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="1.1500000000000001;1"
            begin="0s"
          />
        </rect>
      </g>
      <g transform="translate(73.33333333333333,73.33333333333333)">
        <rect x={-20} y={-20} width={40} height={40} fill="#a2fdd9">
          <animateTransform
            attributeName="transform"
            type="scale"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="1.1500000000000001;1"
            begin="-0.1s"
          />
        </rect>
      </g>
    </svg>
  )
}

export default ChartLoader
