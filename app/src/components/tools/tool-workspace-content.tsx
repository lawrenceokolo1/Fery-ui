import React from 'react';
import styled from '@emotion/styled';
import { FormattedMessage, useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { ToolPanelId } from '../../store/tools-ui';

/** Catalog lookup (dynamic keys). babel-plugin-formatjs forbids non-literal ids in formatMessage. */
function tCatalog(intl: IntlShape, id: string, fallback: string): string {
    const raw = intl.messages?.[id];
    return typeof raw === 'string' && raw.length > 0 ? raw : fallback;
}

const Main = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0.25rem 0 1rem;
    font-family: "Work Sans", sans-serif;
`;

const Inner = styled.div`
    max-width: 48rem;
    margin: 0 auto;
`;

const SubNav = styled.nav`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.25rem;

    button {
        font-size: 0.8rem;
        font-weight: 500;
        padding: 0.45rem 0.75rem;
        border-radius: 0.5rem;
        text-decoration: none;
        color: rgba(210, 210, 220, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        cursor: pointer;
        font-family: inherit;

        &:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.14);
            color: rgba(240, 240, 248, 0.92);
        }

        &.active {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.18);
            color: rgba(248, 248, 252, 0.95);
        }
    }
`;

const Title = styled.h1`
    font-size: 1.35rem;
    font-weight: 700;
    color: rgba(248, 248, 252, 0.96);
    margin: 0 0 0.5rem;
    line-height: 1.25;
`;

const Badge = styled.p`
    display: inline-block;
    margin: 0 0 1rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(180, 185, 198, 0.85);
    padding: 0.28rem 0.55rem;
    border-radius: 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
`;

const Lead = styled.p`
    font-size: 0.95rem;
    line-height: 1.65;
    color: rgba(200, 200, 215, 0.88);
    margin: 0 0 1.25rem;
    max-width: 40rem;
`;

const Placeholder = styled.div`
    margin-top: 0.5rem;
    min-height: 12rem;
    border-radius: 0.75rem;
    border: 1px dashed rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(170, 175, 190, 0.75);
    font-size: 0.88rem;
    padding: 1.5rem;
    text-align: center;
`;

const glassCardCss = `
    border-radius: 1rem;
    background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.09) 0%,
        rgba(255, 255, 255, 0.03) 45%,
        rgba(255, 255, 255, 0.02) 100%
    );
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.06);
`;

const GlassStatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem;
    margin-bottom: 1rem;

    @media (min-width: 36rem) {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
    }
`;

const GlassStatCard = styled.div`
    ${glassCardCss}
    padding: 0.95rem 1rem 1.05rem;
`;

const GlassStatValue = styled.div`
    font-size: 1.35rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    color: rgba(248, 248, 252, 0.96);
    line-height: 1.15;
    margin-bottom: 0.35rem;
`;

const GlassStatLabel = styled.div`
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(175, 180, 195, 0.82);
    line-height: 1.35;
`;

const GlassPanel = styled.section`
    ${glassCardCss}
    padding: 1.05rem 1.15rem 1.2rem;
    margin-bottom: 1rem;
`;

const GlassPanelTitle = styled.h3`
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(195, 200, 215, 0.88);
    margin: 0 0 0.85rem;
`;


const OpsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;

    th {
        text-align: left;
        font-weight: 600;
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: rgba(165, 170, 185, 0.75);
        padding: 0.35rem 0.4rem 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    td {
        padding: 0.4rem 0.4rem;
        color: rgba(220, 222, 232, 0.9);
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        font-variant-numeric: tabular-nums;
    }

    tr:hover td {
        background: rgba(255, 255, 255, 0.03);
    }
`;

const OpsFootnote = styled.p`
    font-size: 0.7rem;
    color: rgba(150, 155, 170, 0.72);
    margin: 0.85rem 0 0;
    line-height: 1.55;
    max-width: 42rem;
`;

const FareSection = styled.section`
    margin-bottom: 1.75rem;
`;

const FareSectionTitle = styled.h3`
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgba(200, 205, 218, 0.9);
    margin: 0 0 0.6rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const FareTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;

    th {
        text-align: left;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: rgba(180, 185, 198, 0.7);
        padding: 0.4rem 0.6rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    td {
        padding: 0.4rem 0.6rem;
        color: rgba(220, 220, 232, 0.9);
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    tr:hover td {
        background: rgba(255, 255, 255, 0.03);
    }

    td:last-child {
        text-align: right;
        font-variant-numeric: tabular-nums;
        font-weight: 500;
    }
`;

const RouteTab = styled.button<{ active?: boolean }>`
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.4rem 0.7rem;
    border-radius: 0.4rem;
    border: 1px solid ${p => p.active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'};
    background: ${p => p.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)'};
    color: ${p => p.active ? 'rgba(248,248,252,0.95)' : 'rgba(210,210,220,0.7)'};
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(240, 240, 248, 0.92);
    }
`;

const RouteTabRow = styled.div`
    display: flex;
    gap: 0.35rem;
    margin-bottom: 1.25rem;
`;

const FreeNote = styled.p`
    font-size: 0.82rem;
    color: rgba(180, 185, 198, 0.75);
    margin: 0.75rem 0 0;
    font-style: italic;
`;

/** Short legal-style note under Fare / Advisories (matches OpsFootnote density). */
const TabDisclaimer = styled.p`
    font-size: 0.7rem;
    color: rgba(150, 155, 170, 0.72);
    margin: 0.85rem 0 0;
    line-height: 1.5;
    max-width: 42rem;
`;

function toolPageTitle(toolId: ToolPanelId, intl: ReturnType<typeof useIntl>) {
    if (toolId === 'operations') {
        return intl.formatMessage({
            id: 'ui.toolPage.title.operations',
            defaultMessage: 'Operations Dashboard',
        });
    }
    if (toolId === 'fares') {
        return intl.formatMessage({
            id: 'ui.toolPage.title.fares',
            defaultMessage: 'Fare Information',
        });
    }
    return intl.formatMessage({
        id: 'ui.toolPage.title.advisories',
        defaultMessage: 'Service Advisories',
    });
}

function ToolPageLead({ toolId }: { toolId: ToolPanelId }) {
    if (toolId === 'fares') {
        return (
            <FormattedMessage
                id="ui.toolPage.lead.fares"
                defaultMessage="Published tariff tables, passenger and vehicle categories, and specials will appear here once the fare feed is wired in."
            />
        );
    }
    return (
        <FormattedMessage
            id="ui.toolPage.lead.advisories"
            defaultMessage="Official STQ notices, disruptions, and weather holds will stream into this panel from the advisories source."
        />
    );
}

type FareProduct = { nameId: string; nameEn: string; nameFr: string; price: string };
type FareCategory = { catId: string; catEn: string; catFr: string; products: FareProduct[] };
type RouteFares = {
    route: string;
    labelId: string; labelEn: string; labelFr: string;
    officialUrlEn: string; officialUrlFr: string;
    categories: FareCategory[];
};

const SourceLink = styled.a`
    display: inline-block;
    margin-top: 0.75rem;
    font-size: 0.8rem;
    color: rgba(210, 210, 220, 0.75);
    text-decoration: none;
    &:hover { text-decoration: underline; color: rgba(248, 248, 252, 0.95); }
`;

const FARE_DATA: RouteFares[] = [
    {
        route: 'quebec',
        labelId: 'fare.route.quebec', labelEn: 'Quebec City \u2194 Lévis', labelFr: 'Québec \u2194 Lévis',
        officialUrlEn: 'https://www.traversiers.com/en/our-ferries/quebec-city-levis-ferry/fares',
        officialUrlFr: 'https://www.traversiers.com/fr/nos-traverses/traverse-quebec-levis/tarifs',
        categories: [
            {
                catId: 'fare.cat.qc.passenger', catEn: 'Foot passenger, cyclist, or vehicle passenger', catFr: 'Piéton, cycliste ou passager de véhicule',
                products: [
                    { nameId: 'fare.age0to5', nameEn: 'Age 0 to 5', nameFr: '0 à 5 ans', price: 'Gratuit / Free' },
                    { nameId: 'fare.age6to15', nameEn: 'Age 6 to 15', nameFr: '6 à 15 ans', price: '$2.95' },
                    { nameId: 'fare.age16to64', nameEn: 'Age 16 to 64', nameFr: '16 à 64 ans', price: '$4.25' },
                    { nameId: 'fare.age65plus', nameEn: 'Age 65 and over', nameFr: '65 ans et plus', price: '$3.60' },
                    { nameId: 'fare.qc.monthly', nameEn: 'STQ monthly pass', nameFr: 'Passe mensuelle STQ', price: '$43.75' },
                    { nameId: 'fare.qc.transit', nameEn: 'STL/RTC transit pass holder', nameFr: 'Détenteur passe STL/RTC', price: 'Gratuit / Free' },
                ],
            },
            {
                catId: 'fare.cat.qc.vehicle', catEn: 'Vehicle (up to 6.4 m), driver included', catFr: 'Véhicule (jusqu\u2019à 6,4 m), conducteur inclus',
                products: [
                    { nameId: 'fare.qc.veh1664', nameEn: 'Vehicle + driver (16-64)', nameFr: 'Véhicule + conducteur (16-64)', price: '$10.20' },
                    { nameId: 'fare.qc.veh65', nameEn: 'Vehicle + driver (65+)', nameFr: 'Véhicule + conducteur (65+)', price: '$9.60' },
                    { nameId: 'fare.qc.ev', nameEn: 'Electric/hybrid + driver', nameFr: 'Électrique/hybride + conducteur', price: '$4.25' },
                    { nameId: 'fare.qc.moto', nameEn: 'Motorcycle + rider', nameFr: 'Motocyclette + conducteur', price: '$8.75' },
                    { nameId: 'fare.qc.carpool', nameEn: 'Carpooling', nameFr: 'Covoiturage', price: '$17.00' },
                    { nameId: 'fare.qc.trailer', nameEn: 'Trailer', nameFr: 'Remorque', price: '$5.90' },
                ],
            },
            {
                catId: 'fare.cat.qc.bulk', catEn: 'Bulk tickets', catFr: 'Carnets de billets',
                products: [
                    { nameId: 'fare.qc.10veh', nameEn: '10-ticket book (vehicle)', nameFr: 'Carnet 10 passages (véhicule)', price: '$73.00' },
                    { nameId: 'fare.qc.10moto', nameEn: '10-ticket book (motorcycle)', nameFr: 'Carnet 10 passages (moto)', price: '$62.50' },
                ],
            },
        ],
    },
    {
        route: 'sorel',
        labelId: 'fare.route.sorel', labelEn: 'Sorel-Tracy \u2194 Saint-Ignace-de-Loyola', labelFr: 'Sorel-Tracy \u2194 Saint-Ignace-de-Loyola',
        officialUrlEn: 'https://www.traversiers.com/en/our-ferries/sorel-tracy-saint-ignace-de-loyola-ferry/fares',
        officialUrlFr: 'https://www.traversiers.com/fr/nos-traverses/traverse-sorel-tracy-saint-ignace-de-loyola/tarifs',
        categories: [
            {
                catId: 'fare.cat.so.passenger', catEn: 'Foot passenger, cyclist (one-way)', catFr: 'Piéton, cycliste (aller simple)',
                products: [
                    { nameId: 'fare.age0to5', nameEn: 'Age 0 to 5', nameFr: '0 à 5 ans', price: 'Gratuit / Free' },
                    { nameId: 'fare.age6to15', nameEn: 'Age 6 to 15', nameFr: '6 à 15 ans', price: '$2.95' },
                    { nameId: 'fare.age16to64', nameEn: 'Age 16 to 64', nameFr: '16 à 64 ans', price: '$4.25' },
                    { nameId: 'fare.age65plus', nameEn: 'Age 65 and over', nameFr: '65 ans et plus', price: '$3.60' },
                    { nameId: 'fare.so.monthly', nameEn: 'STQ monthly pass', nameFr: 'Passe mensuelle STQ', price: '$43.75' },
                ],
            },
            {
                catId: 'fare.cat.so.vehicle', catEn: 'Vehicle (up to 6.4 m), driver included', catFr: 'Véhicule (jusqu\u2019à 6,4 m), conducteur inclus',
                products: [
                    { nameId: 'fare.so.veh', nameEn: 'Vehicle', nameFr: 'Véhicule', price: '$10.20' },
                    { nameId: 'fare.so.ev', nameEn: 'Electric vehicle', nameFr: 'Véhicule électrique', price: '$4.25' },
                    { nameId: 'fare.so.carpool', nameEn: 'Carpooling', nameFr: 'Covoiturage', price: '$17.00' },
                    { nameId: 'fare.so.10veh', nameEn: '10-ticket book', nameFr: 'Carnet 10 passages', price: '$73.00' },
                ],
            },
            {
                catId: 'fare.cat.so.small', catEn: 'Small vehicle, driver included', catFr: 'Petit véhicule, conducteur inclus',
                products: [
                    { nameId: 'fare.so.moto', nameEn: 'Motorcycle / ATV / scooter', nameFr: 'Moto / VTT / scooter', price: '$8.75' },
                    { nameId: 'fare.so.tow', nameEn: 'Small vehicle towing', nameFr: 'Petit véhicule remorquant', price: '$10.20' },
                    { nameId: 'fare.so.10small', nameEn: '10-ticket book', nameFr: 'Carnet 10 passages', price: '$62.50' },
                ],
            },
        ],
    },
    {
        route: 'matane',
        labelId: 'fare.route.matane', labelEn: 'Matane \u2194 Baie-Comeau / Godbout', labelFr: 'Matane \u2194 Baie-Comeau / Godbout',
        officialUrlEn: 'https://www.traversiers.com/en/our-ferries/matane-baie-comeau-godbout-ferry/fares',
        officialUrlFr: 'https://www.traversiers.com/fr/nos-traverses/traverse-matane-baie-comeau-godbout/tarifs',
        categories: [
            {
                catId: 'fare.cat.ma.passenger', catEn: 'Foot passenger, cyclist (one-way)', catFr: 'Piéton, cycliste (aller simple)',
                products: [
                    { nameId: 'fare.age0to5', nameEn: 'Age 0 to 5', nameFr: '0 à 5 ans', price: 'Gratuit / Free' },
                    { nameId: 'fare.ma.6to15', nameEn: 'Age 6 to 15', nameFr: '6 à 15 ans', price: '$14.50' },
                    { nameId: 'fare.ma.16to64', nameEn: 'Age 16 to 64', nameFr: '16 à 64 ans', price: '$23.60' },
                    { nameId: 'fare.ma.65plus', nameEn: 'Age 65 and over', nameFr: '65 ans et plus', price: '$19.90' },
                    { nameId: 'fare.ma.bike', nameEn: 'Bicycle', nameFr: 'Vélo', price: 'Gratuit / Free' },
                ],
            },
            {
                catId: 'fare.cat.ma.vehicle', catEn: 'Vehicle (up to 6.4 m), driver included', catFr: 'Véhicule (jusqu\u2019à 6,4 m), conducteur inclus',
                products: [
                    { nameId: 'fare.ma.veh', nameEn: 'Standard vehicle', nameFr: 'Véhicule standard', price: '$81.25' },
                    { nameId: 'fare.ma.ev', nameEn: 'Electric vehicle', nameFr: 'Véhicule électrique', price: '$23.60' },
                    { nameId: 'fare.ma.over64', nameEn: 'Over 6.4 m', nameFr: 'Plus de 6,4 m', price: '$81.25 + $23.10/m' },
                ],
            },
            {
                catId: 'fare.cat.ma.small', catEn: 'Small vehicle', catFr: 'Petit véhicule',
                products: [
                    { nameId: 'fare.ma.moto', nameEn: 'Motorcycle + rider', nameFr: 'Motocyclette + conducteur', price: '$64.50' },
                    { nameId: 'fare.ma.tow', nameEn: 'Small vehicle towing', nameFr: 'Petit véhicule remorquant', price: '$81.25' },
                ],
            },
        ],
    },
];

function FarePanel() {
    const intl = useIntl();
    const isFr = intl.locale.startsWith('fr');
    const [activeRoute, setActiveRoute] = React.useState('quebec');
    const route = FARE_DATA.find(r => r.route === activeRoute) ?? FARE_DATA[0];

    return (
        <>
            <RouteTabRow>
                {FARE_DATA.map(r => (
                    <RouteTab
                        key={r.route}
                        active={r.route === activeRoute}
                        onClick={() => setActiveRoute(r.route)}
                    >
                        {tCatalog(intl, r.labelId, r.labelEn)}
                    </RouteTab>
                ))}
            </RouteTabRow>
            {route.categories.map(cat => (
                <FareSection key={cat.catId}>
                    <FareSectionTitle>
                        {tCatalog(intl, cat.catId, cat.catEn)}
                    </FareSectionTitle>
                    <FareTable>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="fare.col.product" defaultMessage="Product" /></th>
                                <th style={{ textAlign: 'right' }}><FormattedMessage id="fare.col.price" defaultMessage="Price" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cat.products.map(p => (
                                <tr key={p.nameId}>
                                    <td>{tCatalog(intl, p.nameId, isFr ? p.nameFr : p.nameEn)}</td>
                                    <td>{p.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </FareTable>
                </FareSection>
            ))}
            <SourceLink href={isFr ? route.officialUrlFr : route.officialUrlEn} target="_blank" rel="noopener noreferrer">
                <FormattedMessage id="fare.sourceLink" defaultMessage="View official fares on traversiers.com \u2197" />
            </SourceLink>
            <FreeNote>
                <FormattedMessage
                    id="fare.freeRoutes"
                    defaultMessage="Free routes (no fare): Tadoussac, L'Isle-aux-Coudres, L'Isle-aux-Grues, L'Île-Verte, Saint-Augustin, Harrington Harbour."
                />
            </FreeNote>
            <TabDisclaimer>
                <FormattedMessage
                    id="fare.disclaimer"
                    defaultMessage="Unofficial summary for reference only. Fery is independent open-source software, not affiliated with or endorsed by STQ. Figures may be incomplete or outdated; confirm current fares and rules on traversiers.com."
                />
            </TabDisclaimer>
        </>
    );
}

/** Snapshot figures aligned with quebec_stq.departures backfill (replace via API later). */
const OPS_STATS = {
    totalDepartures: 350_195,
    routesInDataset: 10,
} as const;

const OPS_MONTHLY = [
    { labelEn: 'Apr 25', labelFr: 'avr. 25', v: 8_708 },
    { labelEn: 'May 25', labelFr: 'mai 25', v: 9_456 },
    { labelEn: 'Jun 25', labelFr: 'juin 25', v: 9_940 },
    { labelEn: 'Jul 25', labelFr: 'juil. 25', v: 9_921 },
    { labelEn: 'Aug 25', labelFr: 'août 25', v: 10_714 },
    { labelEn: 'Sep 25', labelFr: 'sep. 25', v: 10_422 },
    { labelEn: 'Oct 25', labelFr: 'oct. 25', v: 9_828 },
    { labelEn: 'Nov 25', labelFr: 'nov. 25', v: 8_719 },
    { labelEn: 'Dec 25', labelFr: 'déc. 25', v: 9_277 },
    { labelEn: 'Jan 26', labelFr: 'janv. 26', v: 9_018 },
    { labelEn: 'Feb 26', labelFr: 'févr. 26', v: 7_776 },
    { labelEn: 'Mar 26', labelFr: 'mars 26', v: 8_067 },
] as const;

const OPS_ROUTES_TOP: { routeId: string; labelEn: string; labelFr: string; departures: number; days: number }[] = [
    { routeId: 'tadoussac', labelEn: 'Tadoussac', labelFr: 'Tadoussac', departures: 102_739, days: 951 },
    { routeId: 'sorel', labelEn: 'Sorel-Tracy', labelFr: 'Sorel-Tracy', departures: 88_896, days: 1286 },
    { routeId: 'quebec', labelEn: 'Québec City–Lévis', labelFr: 'Québec–Lévis', departures: 78_593, days: 1150 },
    { routeId: 'isle-aux-coudres', labelEn: "L'Isle-aux-Coudres", labelFr: "L'Isle-aux-Coudres", departures: 42_098, days: 1139 },
    { routeId: 'riv-st-augustin', labelEn: 'Saint-Augustin', labelFr: 'Saint-Augustin', departures: 19_099, days: 1087 },
];

const OPS_SAILING: { mixId: string; labelEn: string; labelFr: string; count: number }[] = [
    { mixId: 'operations.sailing.regular', labelEn: 'Regular', labelFr: 'Régulier', count: 346_242 },
    { mixId: 'operations.sailing.foot', labelEn: 'Foot only', labelFr: 'Piétons seulement', count: 1394 },
    { mixId: 'operations.sailing.commercial', labelEn: 'Commercial only', labelFr: 'Commercial seulement', count: 1010 },
    { mixId: 'operations.sailing.reservation', labelEn: 'Reservation required', labelFr: 'Réservation requise', count: 997 },
    { mixId: 'operations.sailing.delivery', labelEn: 'Delivery period', labelFr: 'Période de livraison', count: 465 },
    { mixId: 'operations.sailing.dangerous', labelEn: 'Dangerous cargo', labelFr: 'Marchandises dangereuses', count: 87 },
];

const OpsBottomGrid = styled.div`
    display: grid;
    gap: 1rem;
    @media (min-width: 40rem) {
        grid-template-columns: 1.15fr 0.85fr;
        align-items: start;
    }
`;

function OperationsPanel() {
    const intl = useIntl();
    const isFr = intl.locale.startsWith('fr');
    const nf = React.useMemo(
        () => new Intl.NumberFormat(intl.locale.startsWith('fr') ? 'fr-CA' : 'en-CA'),
        [intl.locale],
    );
    const chartData = OPS_MONTHLY.map(row => ({
        label: isFr ? row.labelFr : row.labelEn,
        v: row.v,
    }));

    const dateRange = tCatalog(intl, 'operations.dateRangeValue', isFr ? 'oct. 2022 – avr. 2026' : 'Oct 2022 – Apr 2026');

    return (
        <>
            <GlassStatGrid>
                <GlassStatCard>
                    <GlassStatValue>{nf.format(OPS_STATS.totalDepartures)}</GlassStatValue>
                    <GlassStatLabel>
                        <FormattedMessage id="operations.stat.departures" defaultMessage="Departures on record" />
                    </GlassStatLabel>
                </GlassStatCard>
                <GlassStatCard>
                    <GlassStatValue>{OPS_STATS.routesInDataset}</GlassStatValue>
                    <GlassStatLabel>
                        <FormattedMessage id="operations.stat.routes" defaultMessage="Routes in dataset" />
                    </GlassStatLabel>
                </GlassStatCard>
                <GlassStatCard>
                    <GlassStatValue>{dateRange}</GlassStatValue>
                    <GlassStatLabel>
                        <FormattedMessage id="operations.stat.coverage" defaultMessage="Departure date span" />
                    </GlassStatLabel>
                </GlassStatCard>
            </GlassStatGrid>

            <GlassPanel>
                <GlassPanelTitle>
                    <FormattedMessage id="operations.chart.title" defaultMessage="Departures by month (recent)" />
                </GlassPanelTitle>
                <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
                            <CartesianGrid
                                strokeDasharray="3 6"
                                stroke="rgba(255,255,255,0.06)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="label"
                                tick={{ fill: 'rgba(170,175,190,0.72)', fontSize: 11 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                                tickLine={false}
                                dy={6}
                            />
                            <YAxis
                                tick={{ fill: 'rgba(170,175,190,0.6)', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v: number) => nf.format(v)}
                                width={52}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(22,22,28,0.92)',
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    borderRadius: '0.5rem',
                                    backdropFilter: 'blur(12px)',
                                    fontSize: '0.82rem',
                                    color: 'rgba(240,240,248,0.92)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                                }}
                                labelStyle={{ color: 'rgba(200,205,218,0.8)', fontWeight: 600, marginBottom: 4 }}
                                formatter={(value: number) => [nf.format(value), isFr ? 'Départs' : 'Departures']}
                                cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="v"
                                stroke="rgba(220,222,232,0.85)"
                                strokeWidth={2}
                                dot={{ r: 3.5, fill: 'rgba(248,248,252,0.95)', stroke: 'rgba(180,185,200,0.5)', strokeWidth: 1.5 }}
                                activeDot={{ r: 5.5, fill: 'rgba(255,255,255,0.95)', stroke: 'rgba(200,205,218,0.6)', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </GlassPanel>

            <OpsBottomGrid>
                <GlassPanel>
                    <GlassPanelTitle>
                        <FormattedMessage id="operations.table.routes" defaultMessage="Top routes by departures" />
                    </GlassPanelTitle>
                    <OpsTable>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="operations.col.route" defaultMessage="Route" /></th>
                                <th style={{ textAlign: 'right' }}><FormattedMessage id="operations.col.departures" defaultMessage="Departures" /></th>
                                <th style={{ textAlign: 'right' }}><FormattedMessage id="operations.col.days" defaultMessage="Days" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {OPS_ROUTES_TOP.map(r => (
                                <tr key={r.routeId}>
                                    <td>{tCatalog(intl, `operations.route.${r.routeId}`, isFr ? r.labelFr : r.labelEn)}</td>
                                    <td style={{ textAlign: 'right' }}>{nf.format(r.departures)}</td>
                                    <td style={{ textAlign: 'right' }}>{nf.format(r.days)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </OpsTable>
                </GlassPanel>
                <GlassPanel>
                    <GlassPanelTitle>
                        <FormattedMessage id="operations.table.sailing" defaultMessage="Sailing type mix" />
                    </GlassPanelTitle>
                    <OpsTable>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="operations.col.type" defaultMessage="Type" /></th>
                                <th style={{ textAlign: 'right' }}><FormattedMessage id="operations.col.count" defaultMessage="Count" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {OPS_SAILING.map(s => (
                                <tr key={s.mixId}>
                                    <td>{tCatalog(intl, s.mixId, isFr ? s.labelFr : s.labelEn)}</td>
                                    <td style={{ textAlign: 'right' }}>{nf.format(s.count)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </OpsTable>
                </GlassPanel>
            </OpsBottomGrid>

            <OpsFootnote>
                <FormattedMessage
                    id="operations.disclaimer"
                    defaultMessage="This dashboard is for research and general information only. Fery is an independent open-source project and is not affiliated with, endorsed by, or sponsored by the Société des traversiers du Québec (STQ) or any ferry operator. Figures come from data gathered through public interfaces and local processing; they are not official STQ releases. Automated and AI-assisted outputs may be incomplete or wrong. For schedules, fares, service notices, and any travel decisions, rely on the official STQ website and channels."
                />
            </OpsFootnote>
        </>
    );
}

const AdvisoryCard = styled.div`
    border-radius: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.025);
    padding: 0.85rem 1rem;
    margin-bottom: 0.75rem;
`;

const AdvisoryHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
`;

const StatusDot = styled.span<{ color: string }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${p => p.color};
    flex-shrink: 0;
`;

const AdvisoryRoute = styled.span`
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(240, 240, 248, 0.92);
`;

const AdvisoryDate = styled.span`
    font-size: 0.72rem;
    color: rgba(170, 175, 190, 0.7);
    margin-left: auto;
`;

const AdvisoryImpact = styled.span`
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.2rem 0.45rem;
    border-radius: 0.3rem;
    margin-bottom: 0.4rem;
`;

const AdvisoryMsg = styled.p`
    font-size: 0.84rem;
    line-height: 1.55;
    color: rgba(200, 200, 215, 0.88);
    margin: 0;
`;

type Advisory = {
    route: string;
    routeNameEn: string;
    routeNameFr: string;
    causeEn: string;
    causeFr: string;
    impactEn: string;
    impactFr: string;
    messageEn: string;
    messageFr: string;
    date: string;
};

const ADVISORY_DATA: Advisory[] = [
    {
        route: 'h-harbour-chevery',
        routeNameEn: 'Harrington Harbour\u2013Chevery', routeNameFr: 'Harrington Harbour\u2013Chevery',
        causeEn: 'Adverse weather conditions', causeFr: 'Conditions météorologiques défavorables',
        impactEn: 'Air service \u2014 return to normal schedule', impactFr: 'Service aérien \u2014 retour à l\u2019horaire normal',
        messageEn: 'HHC Air service \u2014 Return to normal schedule: APR 12 9:05 a.m.',
        messageFr: 'HHC Service aérien \u2014 Retour à l\u2019horaire normal : 12 AVR 9 h 05.',
        date: '2026-04-12',
    },
    {
        route: 'h-harbour-chevery',
        routeNameEn: 'Harrington Harbour\u2013Chevery', routeNameFr: 'Harrington Harbour\u2013Chevery',
        causeEn: 'Adverse weather conditions', causeFr: 'Conditions météorologiques défavorables',
        impactEn: 'Cancellation until further notice', impactFr: 'Annulation jusqu\u2019à nouvel ordre',
        messageEn: 'HHC adverse weather conditions. Crossings cancelled until further notice.',
        messageFr: 'HHC conditions météo défavorables. Traversées annulées jusqu\u2019à nouvel ordre.',
        date: '2026-04-11',
    },
    {
        route: 'matane',
        routeNameEn: 'Matane\u2013Baie-Comeau\u2013Godbout', routeNameFr: 'Matane\u2013Baie-Comeau\u2013Godbout',
        causeEn: 'Safety exercise', causeFr: 'Exercice de sécurité',
        impactEn: 'Departure time change', impactFr: 'Changement d\u2019heure de départ',
        messageEn: 'MBCG APR 14, safety exercise: the 8 am departure is postponed to 2 pm.',
        messageFr: 'MBCG 14 AVR, exercice de sécurité : le départ de 8 h est reporté à 14 h.',
        date: '2026-04-10',
    },
    {
        route: 'h-harbour-chevery',
        routeNameEn: 'Harrington Harbour\u2013Chevery', routeNameFr: 'Harrington Harbour\u2013Chevery',
        causeEn: 'Adverse weather conditions', causeFr: 'Conditions météorologiques défavorables',
        impactEn: 'Air service \u2014 return to normal schedule', impactFr: 'Service aérien \u2014 retour à l\u2019horaire normal',
        messageEn: 'HHC Air service \u2014 Return to normal schedule: APR 6 7:58 a.m.',
        messageFr: 'HHC Service aérien \u2014 Retour à l\u2019horaire normal : 6 AVR 7 h 58.',
        date: '2026-04-06',
    },
    {
        route: 'h-harbour-chevery',
        routeNameEn: 'Harrington Harbour\u2013Chevery', routeNameFr: 'Harrington Harbour\u2013Chevery',
        causeEn: 'Adverse weather conditions', causeFr: 'Conditions météorologiques défavorables',
        impactEn: 'Cancellation until further notice', impactFr: 'Annulation jusqu\u2019à nouvel ordre',
        messageEn: 'HHC adverse weather conditions. Crossings cancelled until further notice.',
        messageFr: 'HHC conditions météo défavorables. Traversées annulées jusqu\u2019à nouvel ordre.',
        date: '2026-04-05',
    },
    {
        route: 'tadoussac',
        routeNameEn: 'Tadoussac\u2013Baie-Sainte-Catherine', routeNameFr: 'Tadoussac\u2013Baie-Sainte-Catherine',
        causeEn: 'Schedule modification', causeFr: 'Modification à l\u2019horaire',
        impactEn: 'Modified schedule', impactFr: 'Horaire modifié',
        messageEn: 'TBSC Service changes in effect from Wednesday, March 25 through the maintenance period.',
        messageFr: 'TBSC Changements de service en vigueur depuis le mercredi 25 mars pour la période d\u2019entretien.',
        date: '2026-03-24',
    },
    {
        route: 'sorel',
        routeNameEn: 'Sorel-Tracy\u2013Saint-Ignace-de-Loyola', routeNameFr: 'Sorel-Tracy\u2013Saint-Ignace-de-Loyola',
        causeEn: 'Special event', causeFr: 'Événement spécial',
        impactEn: 'Return to normal schedule', impactFr: 'Retour à l\u2019horaire normal',
        messageEn: 'STSIL \u2014 The NM Alexandrina-Chalifoux is back in service, and both ships are now operating.',
        messageFr: 'STSIL \u2014 Le NM Alexandrina-Chalifoux est de retour en service, les deux navires sont maintenant en exploitation.',
        date: '2026-03-21',
    },
];

function impactStyle(impact: string): { dot: string; bg: string; text: string } {
    const lower = impact.toLowerCase();
    if (lower.includes('cancel') || lower.includes('annul'))
        return { dot: 'rgba(255,255,255,0.9)', bg: 'rgba(255,255,255,0.1)', text: 'rgba(248,248,252,0.95)' };
    if (lower.includes('modif') || lower.includes('change') || lower.includes('moved') || lower.includes('postpone') || lower.includes('report'))
        return { dot: 'rgba(200,200,210,0.6)', bg: 'rgba(255,255,255,0.06)', text: 'rgba(210,210,220,0.85)' };
    return { dot: 'rgba(160,165,178,0.45)', bg: 'rgba(255,255,255,0.03)', text: 'rgba(180,185,198,0.75)' };
}

function AdvisoryPanel() {
    const intl = useIntl();
    const isFr = intl.locale.startsWith('fr');

    return (
        <>
            {ADVISORY_DATA.map((a, i) => {
                const impact = isFr ? a.impactFr : a.impactEn;
                const colors = impactStyle(impact);
                return (
                    <AdvisoryCard key={i}>
                        <AdvisoryHeader>
                            <StatusDot color={colors.dot} />
                            <AdvisoryRoute>{isFr ? a.routeNameFr : a.routeNameEn}</AdvisoryRoute>
                            <AdvisoryDate>{a.date}</AdvisoryDate>
                        </AdvisoryHeader>
                        <AdvisoryImpact style={{ background: colors.bg, color: colors.text }}>
                            {impact}
                        </AdvisoryImpact>
                        <AdvisoryMsg>{isFr ? a.messageFr : a.messageEn}</AdvisoryMsg>
                    </AdvisoryCard>
                );
            })}
            <SourceLink
                href={isFr
                    ? 'https://www.traversiers.com/fr/a-propos-de-la-societe/nouvelles-et-communiques'
                    : 'https://www.traversiers.com/en/about-stq/news-and-press-releases'}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FormattedMessage id="advisory.sourceLink" defaultMessage="Official STQ news and notices on traversiers.com \u2197" />
            </SourceLink>
            <TabDisclaimer>
                <FormattedMessage
                    id="advisory.disclaimer"
                    defaultMessage="Sample notices for illustration only. Fery is not affiliated with STQ. For authoritative, up-to-date service advisories, use traversiers.com and official STQ channels."
                />
            </TabDisclaimer>
        </>
    );
}

export interface ToolWorkspaceContentProps {
    toolId: ToolPanelId;
    onSelectTool: (id: ToolPanelId) => void;
}

export function ToolWorkspaceContent(props: ToolWorkspaceContentProps) {
    const { toolId, onSelectTool } = props;
    const intl = useIntl();
    const title = toolPageTitle(toolId, intl);

    let content: React.ReactNode;
    if (toolId === 'operations') {
        content = <OperationsPanel />;
    } else if (toolId === 'fares') {
        content = <FarePanel />;
    } else if (toolId === 'advisories') {
        content = <AdvisoryPanel />;
    } else {
        content = (
            <Placeholder>
                <FormattedMessage
                    id="ui.toolPage.placeholder"
                    defaultMessage="Dashboard widgets and live data will mount in this area."
                />
            </Placeholder>
        );
    }

    return (
        <Main>
            <Inner>
                <SubNav>
                    <button
                        type="button"
                        className={toolId === 'operations' ? 'active' : ''}
                        onClick={() => onSelectTool('operations')}
                    >
                        <FormattedMessage id="ui.tool.operationsDashboard" defaultMessage="Operations Dashboard" />
                    </button>
                    <button
                        type="button"
                        className={toolId === 'fares' ? 'active' : ''}
                        onClick={() => onSelectTool('fares')}
                    >
                        <FormattedMessage id="ui.tool.fareInformation" defaultMessage="Fare Information" />
                    </button>
                    <button
                        type="button"
                        className={toolId === 'advisories' ? 'active' : ''}
                        onClick={() => onSelectTool('advisories')}
                    >
                        <FormattedMessage id="ui.tool.serviceAdvisories" defaultMessage="Service Advisories" />
                    </button>
                </SubNav>
                <Title>{title}</Title>
                <Badge>
                    <FormattedMessage id="ui.toolPage.inDevelopment" defaultMessage="In active development" />
                </Badge>
                {toolId !== 'operations' && (
                    <Lead>
                        <ToolPageLead toolId={toolId} />
                    </Lead>
                )}
                {content}
            </Inner>
        </Main>
    );
}
