import { useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { setToolPanel, type ToolPanelId } from '../../store/tools-ui';

const VALID = new Set<string>(['operations', 'fares', 'advisories']);

/**
 * Handles /tools/:toolId (bookmarks, shared links). Opens the matching tool drawer
 * then replaces the URL with / so the app shell matches a known route.
 */
export default function ToolDeepLinkRedirect() {
    const { toolId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        if (toolId && VALID.has(toolId)) {
            dispatch(setToolPanel(toolId as ToolPanelId));
        }
        navigate('/', { replace: true });
    }, [toolId, dispatch, navigate]);

    return null;
}
