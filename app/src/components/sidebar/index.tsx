import styled from '@emotion/styled';
import { ActionIcon, Avatar, Burger, Button, Menu } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { backend } from '../../core/backend';
import { useAppContext } from '../../core/context';
import { useLocale } from '../../core/locale';
import { useAppDispatch, useAppSelector } from '../../store';
import { setTab } from '../../store/settings-ui';
import { closeSidebar, selectSidebarOpen, toggleSidebar } from '../../store/sidebar';
import { setToolPanel } from '../../store/tools-ui';
import RecentChats from './recent-chats';
import { FerryMark } from '../ferry-mark';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;

    font-family: "Work Sans", sans-serif;
    box-shadow: 0px 0px 1rem 0.2rem rgb(0 0 0 / 12%);

    .sidebar-header {
        padding: 1rem 0.8rem 0.75rem 1rem;
        min-height: 3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.55rem;
    }

    .brand-icon {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.06) 60%, transparent 80%);
        border: 1px solid rgba(255, 255, 255, 0.12);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .brand-text h2 {
        font-size: 0.95rem;
        font-weight: 700;
        color: rgba(248, 248, 253, 0.95);
        line-height: 1.2;
    }

    .brand-text span {
        font-size: 0.68rem;
        color: rgba(200, 200, 210, 0.6);
        font-weight: 400;
        display: block;
    }

    .locale-toggle {
        margin: 0.65rem 0.75rem 0;
        display: flex;
        justify-content: flex-start;
        gap: 0.35rem;
    }

    .locale-pill {
        font-family: "Work Sans", sans-serif;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.28rem 0.62rem;
        border-radius: 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.10);
        background: rgba(255, 255, 255, 0.03);
        color: rgba(230, 230, 238, 0.78);
        cursor: pointer;

        &.active {
            background: rgba(255, 255, 255, 0.08);
            color: rgba(245, 245, 250, 0.95);
            border-color: rgba(255, 255, 255, 0.18);
        }
    }

    .new-chat-btn {
        margin: 0.85rem 0.75rem 0.35rem;

        .mantine-Button-root {
            width: 100%;
            border-radius: 0.55rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(240, 240, 248, 0.9);
            font-weight: 500;
            font-size: 0.85rem;
            padding: 0.55rem 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            &:hover {
                background: rgba(255, 255, 255, 0.07);
                border-color: rgba(255, 255, 255, 0.16);
            }
        }
    }

    .tools-section {
        padding: 0.6rem 0.75rem 0;

        .tools-heading {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.78rem;
            font-weight: 600;
            color: rgba(220, 220, 230, 0.75);
            margin-bottom: 0.4rem;
            padding-left: 0.25rem;

            i {
                font-size: 0.75rem;
                color: rgba(220, 220, 232, 0.7);
            }
        }
    }

    .tool-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 0.65rem;
        border-radius: 0.45rem;
        cursor: pointer;
        color: rgba(230, 230, 240, 0.85);
        font-size: 0.84rem;
        font-weight: 400;
        transition: background 0.15s;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        font-family: inherit;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        i {
            width: 1.2rem;
            text-align: center;
            font-size: 0.82rem;
            color: rgba(200, 200, 210, 0.65);
        }
    }

    .sidebar-content {
        flex-grow: 1;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;

        min-width: 15rem;

        padding-bottom: 0.75rem;
    }

    .sidebar-disclaimer {
        flex-shrink: 0;
        padding: 0.45rem 0.75rem 0.35rem;
        border-top: 1px solid rgba(255, 255, 255, 0.06);

        p {
            margin: 0;
            font-size: 0.62rem;
            line-height: 1.42;
            color: rgba(148, 153, 168, 0.78);
            letter-spacing: 0.01em;
        }
    }

    .sidebar-settings {
        flex-shrink: 0;
        padding: 0.3rem 0.75rem 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .sidebar-footer {
        border-top: thin solid rgba(255, 255, 255, 0.08);
        padding: 0.5rem 1.118rem;
        padding-left: 0.5rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        font-size: 1rem;
        cursor: pointer;

        .user-info {
            max-width: calc(100% - 1.618rem * 2 - 2.5rem);
            margin-right: 0.5rem;
        }

        strong, span {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        strong {
            font-weight: bold;
            margin-bottom: 0.2rem;
        }

        span {
            font-size: 0.8rem;
            font-weight: 100;
        }

        .mantine-Avatar-root {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            overflow: hidden;
            width: 2.5rem;
            height: 2.5rem;
            min-width: 0;
            flex-grow: 0;
            flex-shrink: 0;
            margin: 0.5rem;
        }
    }

    .spacer {
        flex-grow: 1;
    }
`;

export default function Sidebar(props: {
    className?: string;
}) {
    const intl = useIntl();
    const context = useAppContext();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { locale, setLocale } = useLocale();
    const sidebarOpen = useAppSelector(selectSidebarOpen);
    const onBurgerClick = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
    const { ref, width } = useElementSize();

    const [version, setVersion] = useState(0);
    const update = useCallback(() => {
        setVersion(v => v + 1);
    }, []);
    
    useEffect(() => {
        context.chat.on('update', update);
        return () => {
            context.chat.off('update', update);
        };
    }, []);

    const onNewChat = useCallback(() => {
        navigate('/');
        setTimeout(() => document.querySelector<HTMLTextAreaElement>('#message-input')?.focus(), 100);
    }, [navigate]);

    const goTool = useCallback((suffix: 'operations' | 'fares' | 'advisories') => {
        dispatch(setToolPanel(suffix));
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 40em)').matches) {
            dispatch(closeSidebar());
        }
    }, [dispatch]);

    const burgerLabel = sidebarOpen
        ? intl.formatMessage({ defaultMessage: "Close sidebar" })
        : intl.formatMessage({ defaultMessage: "Open sidebar" });

    const opsHint = intl.formatMessage({ id: 'ui.tool.operationsDashboardHint', defaultMessage: 'Year-to-date departures by port and route. Full analytics API is in development.' });
    const fareHint = intl.formatMessage({ id: 'ui.tool.fareInformationHint', defaultMessage: 'Current published fares and tariff information.' });
    const advisoryHint = intl.formatMessage({ id: 'ui.tool.serviceAdvisoriesHint', defaultMessage: 'Official notices, service changes, and emergency advisories from the operator.' });

    const elem = useMemo(() => (
        <Container className={"sidebar " + (sidebarOpen ? 'opened' : 'closed')} ref={ref}>
            <div className="sidebar-header">
                <div
                    className="brand"
                    title="Fery AI assistant for real-time + analytical ferry updates (starting with Québec STQ)."
                >
                    <div className="brand-icon">
                        <FerryMark width={20} breathe />
                    </div>
                    <div className="brand-text">
                        <h2>Fery</h2>
                        <span>
                            <FormattedMessage id="ui.brandSubtitle" defaultMessage="Ferry AI assistant" />
                        </span>
                    </div>
                </div>
                <Burger opened={sidebarOpen} onClick={onBurgerClick} aria-label={burgerLabel} transitionDuration={0} size="sm" />
            </div>
            <div className="locale-toggle">
                <button
                    className={"locale-pill " + (locale === 'fr-ca' ? 'active' : '')}
                    onClick={() => setLocale('fr-ca')}
                    aria-label="Afficher l’interface en français (Québec)"
                >
                    Français
                </button>
                <button
                    className={"locale-pill " + (locale === 'en-ca' ? 'active' : '')}
                    onClick={() => setLocale('en-ca')}
                    aria-label="Show interface in English"
                >
                    English
                </button>
            </div>
            <div className="new-chat-btn">
                <Button variant="subtle" fullWidth leftIcon={<i className="fa fa-pen-to-square" />} onClick={onNewChat}>
                    <FormattedMessage id="ui.startNewChat" defaultMessage="Start a New Chat" />
                </Button>
            </div>
            <div className="tools-section">
                <div className="tools-heading">
                    <i className="fa fa-wand-magic-sparkles" />
                    <FormattedMessage id="ui.advancedTools" defaultMessage="Advanced Tools" />
                </div>
                <button type="button" className="tool-item" title={opsHint} onClick={() => goTool('operations')}>
                    <i className="fa fa-chart-line" />
                    <FormattedMessage id="ui.tool.operationsDashboard" defaultMessage="Operations Dashboard" />
                </button>
                <button type="button" className="tool-item" title={fareHint} onClick={() => goTool('fares')}>
                    <i className="fa fa-tags" />
                    <FormattedMessage id="ui.tool.fareInformation" defaultMessage="Fare Information" />
                </button>
                <button type="button" className="tool-item" title={advisoryHint} onClick={() => goTool('advisories')}>
                    <i className="fa fa-bullhorn" />
                    <FormattedMessage id="ui.tool.serviceAdvisories" defaultMessage="Service Advisories" />
                </button>
            </div>
            <div className="sidebar-content">
                <RecentChats />
            </div>
            <div className="sidebar-disclaimer">
                <p>
                    <FormattedMessage
                        id="ui.sidebarDisclaimer"
                        defaultMessage="Independent open-source project, not affiliated with STQ. Confirm schedules, fares, and notices on traversiers.com."
                    />
                </p>
            </div>
            <div className="sidebar-settings">
                <button
                    type="button"
                    className="tool-item"
                    onClick={() => dispatch(setTab('ui'))}
                >
                    <i className="fa fa-gear" />
                    <FormattedMessage id="ui.sidebarSettings" defaultMessage="Settings" description="Opens the settings drawer (same as header gear)" />
                </button>
            </div>
            {context.authenticated && (
                <Menu width={width - 20}>
                    <Menu.Target>
                        <div className="sidebar-footer">
                            <Avatar size="lg" src={context.user!.avatar} />
                            <div className="user-info">
                                <strong>{context.user!.name || context.user!.email}</strong>
                                {!!context.user!.name && <span>{context.user!.email}</span>}
                            </div>
                            <div className="spacer" />

                            <ActionIcon variant="subtle">
                                <i className="fas fa-ellipsis" />
                            </ActionIcon>
                        </div>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item color="red" onClick={() => backend.current?.logout()} icon={<i className="fas fa-sign-out-alt" />}>
                            <FormattedMessage defaultMessage={"Sign out"} />
                        </Menu.Item>

                    </Menu.Dropdown>
                </Menu>
            )}
        </Container>
    ), [sidebarOpen, width, ref, burgerLabel, onBurgerClick, onNewChat, goTool, dispatch, version, locale, opsHint, fareHint, advisoryHint]);

    return elem;
}