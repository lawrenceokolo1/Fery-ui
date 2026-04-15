import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FerryMark } from './ferry-mark';

const pulse = keyframes`
    0%, 100% {
        box-shadow: 0 0 0.75rem rgba(255, 255, 255, 0.06), 0 0 1.25rem rgba(255, 255, 255, 0.03);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 1rem rgba(255, 255, 255, 0.1), 0 0 1.6rem rgba(255, 255, 255, 0.05);
        transform: scale(1.03);
    }
`;

const Ring = styled.div`
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    pointer-events: none;
`;

const Orb = styled.div`
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    flex-shrink: 0;
    background:
        radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.12), transparent 52%),
        radial-gradient(circle at 68% 68%, rgba(255, 255, 255, 0.06), transparent 58%),
        radial-gradient(circle at 50% 50%, rgba(40, 40, 44, 0.98), rgba(12, 12, 14, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: ${pulse} 3s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
`;

/** Breathing circle + ferry mark for assistant messages (matches landing vibe). */
export function AssistantOrb() {
    return (
        <Orb aria-hidden>
            <Ring />
            <FerryMark width={22} breathe />
        </Orb>
    );
}
