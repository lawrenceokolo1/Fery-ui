import styled from '@emotion/styled';
import { Button, CopyButton, Loader, Textarea } from '@mantine/core';

import { useOption } from '../core/options/use-option';
import { Message } from "../core/chat/types";
import { share } from '../core/utils';
import { Markdown } from './markdown';
import { AssistantOrb } from './assistant-orb';
import { useAppContext } from '../core/context';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppSelector } from '../store';
import { selectSettingsTab } from '../store/settings-ui';

const SROnly = styled.span`
    position: fixed;
    left: -9999px;
    top: -9999px;
`;

const Container = styled.div`
    position: relative;
    background: transparent;

    &.by-assistant + &.by-assistant,
    &.by-user + &.by-user {
        margin-top: 0.15rem;
    }
`;

const MessageRow = styled.div`
    max-width: 52rem;
    margin: 0 auto;
    padding: 0.4rem 1rem;

    @media (max-width: 40em) {
        padding: 0.4rem 0.65rem;
    }
`;

const Stack = styled.div<{ $assistant: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: ${p => (p.$assistant ? 'flex-start' : 'flex-end')};
    gap: 0.35rem;
    width: min(44rem, 100%);
    max-width: 100%;
    ${p => (p.$assistant ? '' : 'margin-left: auto;')}
`;

const AssistantBody = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 0.65rem;
    justify-content: flex-start;
    width: 100%;
    max-width: min(44rem, 100%);
`;

const Metadata = styled.div<{ $assistant: boolean }>`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    font-family: "Work Sans", sans-serif;
    font-size: 0.78rem;
    font-weight: 400;
    opacity: 0.55;

    ${p =>
        p.$assistant
            ? `
        width: 100%;
        max-width: min(44rem, 100%);
    `
            : `
        width: auto;
        max-width: min(40rem, 100%);
        align-self: flex-end;
        flex-direction: row-reverse;
        justify-content: flex-start;
    `}

    .mantine-Button-root {
        color: #ccc;
        font-size: 0.78rem;
        font-weight: 400;

        .mantine-Button-label {
            display: flex;
            align-items: center;
        }
    }

    .fa + span {
        margin-left: 0.2em;

        @media (max-width: 40em) {
            display: none;
        }
    }
`;

const MetaActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
`;

const Bubble = styled.div<{ $assistant: boolean }>`
    border-radius: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    background: ${p =>
        p.$assistant ? 'rgba(20, 20, 24, 0.94)' : 'rgba(32, 32, 38, 0.94)'};
    box-sizing: border-box;

    ${p =>
        p.$assistant
            ? `
        flex: 1 1 auto;
        min-width: 0;
        max-width: calc(100% - 3.25rem);
    `
            : `
        max-width: min(40rem, 100%);
    `}

    .content {
        font-family: "Open Sans", sans-serif;
        margin-top: 0;
        max-width: 100%;
        text-align: left;

        * {
            color: white;
        }

        p, ol, ul, li, h1, h2, h3, h4, h5, h6, img, blockquote, & > pre {
            max-width: 100%;
            margin-left: 0;
            margin-right: 0;
        }

        img {
            display: block;
            max-width: 100%;
        }

        ol {
            counter-reset: list-item;

            li {
                counter-increment: list-item;
            }
        }

        em, i {
            font-style: italic;
        }

        code {
            &, * {
                font-family: "Fira Code", monospace !important;
            }
            vertical-align: bottom;
        }

        table {
            margin-top: 1rem;
            border-spacing: 0px;
            border-collapse: collapse;
            border: thin solid rgba(255, 255, 255, 0.1);
            width: 100%;
            max-width: 100%;
        }
        td + td, th + th {
            border-left: thin solid rgba(255, 255, 255, 0.1);
        }
        tr {
            border-top: thin solid rgba(255, 255, 255, 0.1);
        }
        table td,
        table th {
            padding: 0.5rem 0.75rem;
        }
        th {
            font-weight: 600;
            background: rgba(255, 255, 255, 0.08);
        }
    }
`;

const EndOfChatMarker = styled.div`
    position: absolute;
    bottom: calc(-0.75rem - 0.35rem);
    left: 50%;
    width: 0.4rem;
    height: 0.4rem;
    margin-left: -0.2rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
`;

const Editor = styled.div`
    max-width: min(40rem, 100%);
    margin-top: 0.35rem;

    .mantine-Button-root {
        margin-top: 0.75rem;
    }
`;

function InlineLoader() {
    return (
        <Loader variant="dots" size="xs" style={{
            marginLeft: '0.65rem',
            position: 'relative',
            top: '-0.15rem',
        }} />
    );
}

export default function MessageComponent(props: { message: Message, last: boolean, share?: boolean }) {
    const context = useAppContext();
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState('');
    const intl = useIntl();

    const [katex] = useOption<boolean>('markdown', 'katex');

    const tab = useAppSelector(selectSettingsTab);

    const getRoleName = useCallback((role: string, share = false) => {
        switch (role) {
            case 'user':
                if (share) {
                    return intl.formatMessage({ id: 'role-user-formal', defaultMessage: 'User', description: "Label that is shown above messages written by the user (as opposed to the AI) for publicly shared conversation (third person, formal)." });
                } else {
                    return intl.formatMessage({ id: 'role-user', defaultMessage: 'You', description: "Label that is shown above messages written by the user (as opposed to the AI) in the user's own chat sessions (first person)." });
                }
                break;
            case 'assistant':
                return intl.formatMessage({ id: 'ui.roleAssistant', defaultMessage: 'Fery AI', description: "Label shown above assistant messages in the chat thread" });
            case 'system':
                return intl.formatMessage({ id: 'role-system', defaultMessage: 'System', description: "Label that is shown above messages inserted into the conversation automatically by the system (as opposed to either the user or AI)" });
            default:
                return role;
        }
    }, [intl]);

    const elem = useMemo(() => {
        if (props.message.role === 'system') {
            return null;
        }

        const isAssistant = props.message.role === 'assistant';

        const metadata = (
            <Metadata $assistant={isAssistant}>
                <span>
                    <strong>
                        {getRoleName(props.message.role, props.share)}{props.message.model === 'gpt-4' && ' (GPT 4)'}<SROnly>:</SROnly>
                    </strong>
                    {isAssistant && props.last && !props.message.done && <InlineLoader />}
                </span>
                <MetaActions>
                    <CopyButton value={props.message.content}>
                        {({ copy, copied }) => (
                            <Button variant="subtle" size="sm" compact onClick={copy}>
                                <i className="fa fa-clipboard" />
                                {copied ? <FormattedMessage defaultMessage="Copied" description="Label for copy-to-clipboard button after a successful copy" />
                                    : <span><FormattedMessage defaultMessage="Copy" description="Label for copy-to-clipboard button" /></span>}
                            </Button>
                        )}
                    </CopyButton>
                    {typeof navigator.share !== 'undefined' && (
                        <Button variant="subtle" size="sm" compact onClick={() => share(props.message.content)}>
                            <i className="fa fa-share" />
                            <span>
                                <FormattedMessage defaultMessage="Share" description="Label for a button which shares the text of a chat message using the user device's share functionality" />
                            </span>
                        </Button>
                    )}
                    {!context.isShare && props.message.role === 'user' && (
                        <Button variant="subtle" size="sm" compact onClick={() => {
                            setContent(props.message.content);
                            setEditing(v => !v);
                        }}>
                            <i className="fa fa-edit" />
                            <span>
                                {editing ? <FormattedMessage defaultMessage="Cancel" description="Label for a button that appears when the user is editing the text of one of their messages, to cancel without saving changes" />
                                    : <FormattedMessage defaultMessage="Edit" description="Label for the button the user can click to edit the text of one of their messages" />}
                            </span>
                        </Button>
                    )}
                    {!context.isShare && isAssistant && (
                        <Button variant="subtle" size="sm" compact onClick={() => context.regenerateMessage(props.message)}>
                            <i className="fa fa-refresh" />
                            <span>
                                <FormattedMessage defaultMessage="Regenerate" description="Label for the button used to ask the AI to regenerate one of its messages. Since message generations are stochastic, the resulting message will be different." />
                            </span>
                        </Button>
                    )}
                </MetaActions>
            </Metadata>
        );

        return (
            <Container className={"message by-" + props.message.role}>
                <MessageRow>
                    <Stack $assistant={isAssistant}>
                        {metadata}
                        {isAssistant ? (
                            <AssistantBody>
                                <AssistantOrb />
                                <Bubble $assistant>
                                    <Markdown content={props.message.content}
                                        katex={katex}
                                        className={"content content-" + props.message.id} />
                                </Bubble>
                            </AssistantBody>
                        ) : (
                            <Bubble $assistant={false}>
                                {!editing && <Markdown content={props.message.content}
                                    katex={katex}
                                    className={"content content-" + props.message.id} />}
                                {editing && (
                                    <Editor>
                                        <Textarea value={content}
                                            onChange={e => setContent(e.currentTarget.value)}
                                            autosize={true} />
                                        <Button variant="light" onClick={() => context.editMessage(props.message, content)}>
                                            <FormattedMessage defaultMessage="Save changes" description="Label for a button that appears when the user is editing the text of one of their messages, to save the changes" />
                                        </Button>
                                        <Button variant="subtle" onClick={() => setEditing(false)}>
                                            <FormattedMessage defaultMessage="Cancel" description="Label for a button that appears when the user is editing the text of one of their messages, to cancel without saving changes" />
                                        </Button>
                                    </Editor>
                                )}
                            </Bubble>
                        )}
                    </Stack>
                </MessageRow>
                {props.last && <EndOfChatMarker />}
            </Container>
        )
    }, [props.last, props.share, editing, content, context, props.message, props.message.content, tab, katex, getRoleName]);

    return elem;
}
