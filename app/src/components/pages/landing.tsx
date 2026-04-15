import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FormattedMessage } from 'react-intl';
import { FerryMark } from '../ferry-mark';
import { Page } from '../page';

const pulse = keyframes`
    0%, 100% {
        box-shadow: 0 0 1.4rem rgba(255, 255, 255, 0.08), 0 0 2.6rem rgba(255, 255, 255, 0.04);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 2rem rgba(255, 255, 255, 0.12), 0 0 3.4rem rgba(255, 255, 255, 0.06);
        transform: scale(1.04);
    }
`;

const Container = styled.div`
    flex: 1;
    min-height: 0;
    padding: 2rem 1rem 2.75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Work Sans", sans-serif;
    text-align: center;
    gap: 0.5rem;

    .orb-wrapper {
        position: relative;
        width: 5.5rem;
        height: 5.5rem;
        margin-bottom: 1.2rem;
    }

    .orb {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background:
            radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.14), transparent 52%),
            radial-gradient(circle at 68% 68%, rgba(255, 255, 255, 0.07), transparent 58%),
            radial-gradient(circle at 50% 50%, rgba(40, 40, 44, 0.98), rgba(10, 10, 12, 0.98));
        border: 1px solid rgba(255, 255, 255, 0.12);
        animation: ${pulse} 3s ease-in-out infinite;
    }

    .orb-ferry {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 2px;
    }

    .orb-ring {
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    h1 {
        font-size: clamp(1.6rem, 3vw, 2rem);
        font-weight: 600;
        color: #fafaff;
    }

    p {
        color: rgba(200, 200, 210, 0.8);
        font-size: 1.05rem;
        font-weight: 400;
    }
`;

export default function LandingPage(props: any) {
    return <Page id={'landing'} showSubHeader={false}>
        <Container>
            <div className="orb-wrapper">
                <div className="orb-ring" />
                <div className="orb">
                    <div className="orb-ferry">
                        <FerryMark width={46} breathe />
                    </div>
                </div>
            </div>
            <h1>
                <FormattedMessage id="ui.landingHey" defaultMessage="Hey !" />
            </h1>
            <p>
                <FormattedMessage id="ui.landingAssist" defaultMessage="How may I assist you today?" />
            </p>
        </Container>
    </Page>;
}
