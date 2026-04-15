import styled from '@emotion/styled';
import { Button, Drawer } from '@mantine/core';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeToolPanel, selectToolPanel, setToolPanel, type ToolPanelId } from '../../store/tools-ui';
import { ToolWorkspaceContent } from './tool-workspace-content';

const Container = styled.div`
    padding: 0.4rem 1rem 0;
    position: absolute;
    inset: 0;
    max-width: 100vw;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    min-height: 0;

    @media (max-width: 40em) {
        padding: 0 0.75rem 0;
    }

    #tool-drawer-footer {
        flex-shrink: 0;
        padding: 0 0 1rem;
        margin-top: auto;

        .mantine-Button-root {
            height: 3rem;
        }
    }
`;

export default function ToolDrawer() {
    const panel = useAppSelector(selectToolPanel);
    const dispatch = useAppDispatch();
    const close = useCallback(() => dispatch(closeToolPanel()), [dispatch]);
    const onSelectTool = useCallback((id: ToolPanelId) => dispatch(setToolPanel(id)), [dispatch]);

    const opened = !!panel;
    const toolId = (panel || 'operations') as ToolPanelId;

    return (
        <Drawer
            size="50rem"
            position="right"
            opened={opened}
            onClose={close}
            transition="slide-left"
            transitionDuration={200}
            withCloseButton={false}
        >
            <Container>
                {opened ? (
                    <>
                        <ToolWorkspaceContent toolId={toolId} onSelectTool={onSelectTool} />
                        <div id="tool-drawer-footer">
                            <Button variant="light" fullWidth size="md" onClick={close}>
                                <FormattedMessage
                                    id="ui.toolPage.closeDrawer"
                                    defaultMessage="Close"
                                    description="Closes the tools / dashboard drawer, same role as Save and Close on settings"
                                />
                            </Button>
                        </div>
                    </>
                ) : null}
            </Container>
        </Drawer>
    );
}
