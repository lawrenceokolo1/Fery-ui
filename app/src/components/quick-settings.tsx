import styled from '@emotion/styled';
import { useAppContext } from '../core/context';
import { Option } from '../core/options/option';
import { useOption } from '../core/options/use-option';
import { Button } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../store';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { setTabAndOption } from '../store/settings-ui';
import { setMessage } from '../store/message';

const Container = styled.div`
    margin: 0.75rem -0.5rem 0;

    display: flex;
    flex-wrap: wrap;
    text-align: left;

    justify-content: center;

    .mantine-Button-root {
        font-size: 0.78rem;
        color: rgba(236, 236, 242, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.025);
        border-radius: 0.75rem;
        margin: 0.25rem;

        &:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.16);
        }
    }
`;

const SuggestionContainer = styled.div`
    margin: 0.65rem -0.25rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.35rem;
`;

const SuggestionChip = styled.button`
    font-family: "Work Sans", sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(220, 220, 230, 0.85);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.25rem;
    padding: 0.5rem 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.16);
        color: rgba(240, 240, 248, 0.95);
    }
`;

export function QuickSettingsButton(props: { groupID: string, option: Option }) {
    const context = useAppContext();
    const dispatch = useAppDispatch();

    const [value] = useOption(props.groupID, props.option.id, context.id || undefined);

    const onClick = useCallback(() => {
        const screen = props.option.displayOnSettingsScreen === 'chat' || props.option.displayOnSettingsScreen === 'speech'
            ? 'ui'
            : props.option.displayOnSettingsScreen;
        dispatch(setTabAndOption({ tab: screen, option: props.option.id }));
    }, [props.groupID, props.option.id, dispatch]);

    const labelBuilder = props.option.displayInQuickSettings?.label;
    let label = props.option.id;
    
    if (labelBuilder) {
        label = typeof labelBuilder === 'string' ? labelBuilder : labelBuilder(value, context.chat.options, context);
    }

    return (
        <Button variant="subtle" size="xs" compact onClick={onClick}>
            <span>
                {label}
            </span>
        </Button>
    )
}

export default function QuickSettings(props: any) {
    const context = useAppContext();
    const dispatch = useAppDispatch();
    const intl = useIntl();
    const pathname = useLocation().pathname;
    const isLanding = pathname === '/';
    const options = context.chat.getQuickSettings().filter(
        (o) => o.option.displayOnSettingsScreen === 'ui',
    );

    const onLandingPick = useCallback((descriptor: MessageDescriptor) => {
        dispatch(setMessage(intl.formatMessage(descriptor)));
        setTimeout(() => document.querySelector<HTMLTextAreaElement>('#message-input')?.focus(), 50);
    }, [dispatch, intl]);

    if (isLanding) {
        return (
            <SuggestionContainer>
                <SuggestionChip onClick={() => onLandingPick({ id: 'ui.landingSuggest.dangerousGoods', defaultMessage: 'Dangerous goods' })}>
                    <FormattedMessage id="ui.landingSuggest.dangerousGoods" defaultMessage="Dangerous goods" />
                </SuggestionChip>
                <SuggestionChip onClick={() => onLandingPick({ id: 'ui.landingSuggest.dimensionsLoad', defaultMessage: 'Dimensions & load' })}>
                    <FormattedMessage id="ui.landingSuggest.dimensionsLoad" defaultMessage="Dimensions & load" />
                </SuggestionChip>
                <SuggestionChip onClick={() => onLandingPick({ id: 'ui.landingSuggest.reservations', defaultMessage: 'Reservations' })}>
                    <FormattedMessage id="ui.landingSuggest.reservations" defaultMessage="Reservations" />
                </SuggestionChip>
                <SuggestionChip onClick={() => onLandingPick({ id: 'ui.landingSuggest.evPolicy', defaultMessage: 'EV policy' })}>
                    <FormattedMessage id="ui.landingSuggest.evPolicy" defaultMessage="EV policy" />
                </SuggestionChip>
                <SuggestionChip onClick={() => onLandingPick({ id: 'ui.landingSuggest.terminalLocations', defaultMessage: 'Terminal locations' })}>
                    <FormattedMessage id="ui.landingSuggest.terminalLocations" defaultMessage="Terminal locations" />
                </SuggestionChip>
            </SuggestionContainer>
        );
    }

    if (!options.length) {
        return <div style={{ height: '1rem' }} />;
    }

    return <Container>
        {options.map(o => <QuickSettingsButton groupID={o.groupID} option={o.option} key={o.groupID + "." + o.option.id} />)}
    </Container>;
}