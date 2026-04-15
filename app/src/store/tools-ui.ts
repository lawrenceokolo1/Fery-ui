import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

export type ToolPanelId = 'operations' | 'fares' | 'advisories';

const initialState = {
    panel: '' as '' | ToolPanelId,
};

export const toolsUISlice = createSlice({
    name: 'toolsUI',
    initialState,
    reducers: {
        setToolPanel: (state, action: PayloadAction<'' | ToolPanelId>) => {
            state.panel = action.payload;
        },
    },
});

export const { setToolPanel } = toolsUISlice.actions;

export const closeToolPanel = () => toolsUISlice.actions.setToolPanel('');

export const selectToolPanel = (state: RootState) => state.toolsUI.panel;

const toolsUIReducer = toolsUISlice.reducer;
export default toolsUIReducer;
