import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

/** Side-profile ferry silhouette — visual only, no copy. */
const ferryBreathe = keyframes`
    0%, 100% {
        opacity: 0.82;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.03);
    }
`;

const Wrap = styled.span<{ $breathe?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    color: rgba(252, 252, 255, 0.96);
    pointer-events: none;

    ${p =>
        p.$breathe
            ? `
        animation: ${ferryBreathe} 3s ease-in-out infinite;
    `
            : ''}
`;

export function FerryMark(props: {
    /** Approximate width in px; height scales with aspect ratio. */
    width: number;
    breathe?: boolean;
    className?: string;
}) {
    const w = props.width;
    const h = Math.round(w * 0.56);
    return (
        <Wrap $breathe={props.breathe} className={props.className}>
            <svg
                width={w}
                height={h}
                viewBox="0 0 96 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                style={{ shapeRendering: 'geometricPrecision' }}
            >
                <path
                    d="M6 41c16-3.5 68-3.5 84 0"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    opacity="0.42"
                />
                <path
                    d="M10 40 L14 25.5 L71 25.5 L86 30.5 L92 40 Z"
                    fill="currentColor"
                    fillOpacity="0.22"
                />
                <path
                    d="M10 40 L14 25.5 L71 25.5 L86 30.5 L92 40 Z"
                    stroke="currentColor"
                    strokeWidth="1.65"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.92"
                />
                <path
                    d="M14 32.5 H78"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    opacity="0.55"
                />
                <path
                    d="M26 25.5 V14 H66 V25.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.88"
                />
                <path
                    d="M34 14 V10 H60 V14"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.72"
                />
                <rect x="44" y="5" width="8" height="5" rx="0.55" fill="currentColor" fillOpacity="0.45" />
                <rect x="44" y="5" width="8" height="5" rx="0.55" stroke="currentColor" strokeWidth="1.1" fill="none" opacity="0.78" />
                <rect x="32" y="17" width="5.5" height="4.5" rx="0.65" fill="currentColor" fillOpacity="0.42" stroke="currentColor" strokeOpacity="0.72" strokeWidth="0.95" />
                <rect x="41" y="17" width="5.5" height="4.5" rx="0.65" fill="currentColor" fillOpacity="0.42" stroke="currentColor" strokeOpacity="0.72" strokeWidth="0.95" />
                <rect x="50" y="17" width="5.5" height="4.5" rx="0.65" fill="currentColor" fillOpacity="0.42" stroke="currentColor" strokeOpacity="0.72" strokeWidth="0.95" />
                <path
                    d="M78 30.5 L84 27"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.55"
                />
            </svg>
        </Wrap>
    );
}
