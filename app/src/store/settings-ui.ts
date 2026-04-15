import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '.';

const initialState = {
    tab: '',
    option: '',
};

export const settingsUISlice = createSlice({
    name: 'settingsUI',
    initialState,
    reducers: {
        setTab: (state, action: PayloadAction<string|null>) => {
            state.tab = action.payload || '';
        },
        setOption: (state, action: PayloadAction<string|null>) => {
            state.option = action.payload || '';
        },
        setTabAndOption: (state, action: PayloadAction<{ tab: string | null, option: string | null }>) => {
            state.tab = action.payload.tab || '';
            state.option = action.payload.option || '';
        },
    },
})

export const { setTab, setOption, setTabAndOption } = settingsUISlice.actions;

export const closeSettingsUI = () => settingsUISlice.actions.setTabAndOption({ tab: '', option: '' });

export const selectSettingsTab = (state: RootState) => state.settingsUI.tab;
export const selectSettingsOption = (state: RootState) => state.settingsUI.option;

export const openOpenAIApiKeyPanel = () => settingsUISlice.actions.setTabAndOption({ tab: 'ui', option: '' });
export const openElevenLabsApiKeyPanel = () => settingsUISlice.actions.setTabAndOption({ tab: 'ui', option: '' });
export const openSystemPromptPanel = () => settingsUISlice.actions.setTabAndOption({ tab: 'ui', option: '' });
export const openTemperaturePanel = () => settingsUISlice.actions.setTabAndOption({ tab: 'ui', option: '' });

export default settingsUISlice.reducer;