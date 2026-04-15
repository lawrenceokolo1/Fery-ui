import styled from '@emotion/styled';
import { SpotlightProvider } from '@mantine/spotlight';
import { useChatSpotlightProps } from '../spotlight';
import { useAppContext } from '../core/context';
import { LoginModal, CreateAccountModal } from './auth-modals';
import Header, { HeaderProps, SubHeader } from './header';
import MessageInput from './input';
import { InstallUpdateNotification } from './pwa-notifications';
import SettingsDrawer from './settings';
import ToolDrawer from './tools/tool-drawer';
import Sidebar from './sidebar';

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    background: #050505;
    color: #f4f4f6;

    .sidebar {
        width: 0%;
        height: 100%;
        background: linear-gradient(180deg, rgba(18, 18, 19, 0.98) 0%, rgba(11, 11, 12, 0.98) 100%);
        border-right: 1px solid rgba(255, 255, 255, 0.07);
        flex-shrink: 0;
        backdrop-filter: blur(3px);

        @media (min-width: 40em) {
            transition: width 0.2s ease-in-out;
        }

        &.opened {
            width: 17rem;

            @media (max-width: 40em) {
                width: 100%;
                flex-shrink: 0;
            }

            @media (min-width: 80em) {
                width: 18.5rem;
            }
        }
    }

    @media (max-width: 40em) {
        .sidebar.opened + div {
            display: none;
        }
    }
`;

const Main = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    @media (min-height: 30em) {
        overflow: hidden;
    }
`;

export function Page(props: {
    id: string;
    headerProps?: HeaderProps;
    showSubHeader?: boolean;
    children: any;
}) {
    const spotlightProps = useChatSpotlightProps();
    const context = useAppContext();

    return <SpotlightProvider {...spotlightProps}>
        <Container>
            <Sidebar />
            <Main key={props.id} className={context.isHome ? 'home' : ''}>
                <Header share={props.headerProps?.share}
                    canShare={props.headerProps?.canShare}
                    title={props.headerProps?.title}
                    onShare={props.headerProps?.onShare} />
                {props.showSubHeader && <SubHeader />}
                {props.children}
                <MessageInput />
                <SettingsDrawer />
                <ToolDrawer />
                <LoginModal />
                <CreateAccountModal />
                <InstallUpdateNotification />
            </Main>
        </Container>
    </SpotlightProvider>;
}