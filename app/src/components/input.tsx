import styled from '@emotion/styled';
import { Button, ActionIcon, Textarea, Loader } from '@mantine/core';
import { getHotkeyHandler, useHotkeys, useMediaQuery } from '@mantine/hooks';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../core/context';
import { useAppDispatch, useAppSelector } from '../store';
import { selectMessage, setMessage } from '../store/message';
import { selectSettingsTab } from '../store/settings-ui';
import QuickSettings from './quick-settings';
import { useOption } from '../core/options/use-option';

const Container = styled.div`
    padding: 1rem 1rem 0.6rem;
    background: transparent;

    .inner {
        max-width: 52rem;
        margin: auto;
        text-align: right;
    }

    .settings-button {
        margin: 0.5rem -0.4rem 0.5rem 1rem;
        font-size: 0.7rem;
        color: #999;
    }

    &.landing {
        margin-top: 0.75rem;
        padding-top: 0.5rem;
        padding-bottom: 1rem;
    }
`;

export declare type OnSubmit = (name?: string) => Promise<boolean>;

export interface MessageInputProps {
    disabled?: boolean;
}

export default function MessageInput(props: MessageInputProps) {
    const message = useAppSelector(selectMessage);
    const hasVerticalSpace = useMediaQuery('(min-height: 1000px)');

    const navigate = useNavigate();
    const context = useAppContext();
    const dispatch = useAppDispatch();
    const intl = useIntl();

    const tab = useAppSelector(selectSettingsTab);

    const [submitOnEnter] = useOption<boolean>('input', 'submit-on-enter');

    const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setMessage(e.target.value));
    }, [dispatch]);

    const pathname = useLocation().pathname;

    const onSubmit = useCallback(async () => {
        const id = await context.onNewMessage(message);

        if (id) {
            if (!window.location.pathname.includes(id)) {
                navigate('/chat/' + id);
            }
            dispatch(setMessage(''));
        }
    }, [context, message, dispatch, navigate]);

    useHotkeys([
        ['n', () => document.querySelector<HTMLTextAreaElement>('#message-input')?.focus()]
    ]);

    const blur = useCallback(() => {
        document.querySelector<HTMLTextAreaElement>('#message-input')?.blur();
    }, []);

    const rightSection = useMemo(() => {
        return (
            <div style={{
                opacity: '0.8',
                paddingRight: '0.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
                gap: '0.15rem',
            }}>
                {context.generating && (<>
                    <Button variant="subtle" size="xs" compact onClick={() => {
                        context.chat.cancelReply(context.currentChat.chat?.id, context.currentChat.leaf!.id);
                    }}>
                        <FormattedMessage defaultMessage={"Cancel"} description="Label for the button that can be clicked while the AI is generating a response to cancel generation" />
                    </Button>
                    <Loader size="xs" style={{ padding: '0 0.8rem 0 0.5rem' }} />
                </>)}
                {!context.generating && (
                    <ActionIcon
                        size="lg"
                        onClick={onSubmit}
                        aria-label={intl.formatMessage({ id: 'ui.send', defaultMessage: 'Send message' })}
                        title={intl.formatMessage({ id: 'ui.send', defaultMessage: 'Send message' })}
                    >
                        <i className="fa fa-paper-plane" style={{ fontSize: '90%' }} />
                    </ActionIcon>
                )}
            </div>
        );
    }, [onSubmit, props.disabled, context.generating, intl]);

    const disabled = context.generating;

    const isLandingPage = pathname === '/';
    if (context.isShare || (!isLandingPage && !context.id)) {
        return null;
    }

    const hotkeyHandler = useMemo(() => {
        const keys = [
            ['Escape', blur, { preventDefault: true }],
            ['ctrl+Enter', onSubmit, { preventDefault: true }],

        ];
        if (submitOnEnter) {
            keys.unshift(['Enter', onSubmit, { preventDefault: true }]);
        }
        const handler = getHotkeyHandler(keys as any);
        return handler;
    }, [onSubmit, blur, submitOnEnter]);

    return <Container className={isLandingPage ? 'landing' : ''}>
        <div className="inner">
            <Textarea disabled={props.disabled || disabled}
                id="message-input"
                autosize
                minRows={isLandingPage ? 3 : (hasVerticalSpace ? 2 : 2)}
                maxRows={12}
                placeholder={intl.formatMessage({ id: 'ui.askMeAnything', defaultMessage: "Ask me anything" })}
                value={message}
                onChange={onChange}
                rightSection={rightSection}
                rightSectionWidth={context.generating ? 110 : (isLandingPage ? 58 : 56)}
                styles={{
                    input: {
                        borderRadius: isLandingPage ? '1.15rem' : '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'rgba(20, 20, 22, 0.95)',
                        color: '#f5f5fb',
                        fontSize: isLandingPage ? '1.08rem' : '0.95rem',
                        fontWeight: 400,
                        lineHeight: isLandingPage ? 1.52 : 1.55,
                        paddingTop: isLandingPage ? '1.05rem' : '0.9rem',
                        paddingBottom: isLandingPage ? '1.05rem' : '0.9rem',
                        paddingLeft: isLandingPage ? '1.2rem' : '1.05rem',
                        paddingRight: isLandingPage ? '0.45rem' : '0.35rem',
                        '&::placeholder': {
                            color: 'rgba(180, 180, 195, 0.45)',
                        },
                    },
                }}
                onKeyDown={hotkeyHandler} />
            <QuickSettings key={tab} />
        </div>
    </Container>;
}
