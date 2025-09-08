export interface Chaos {
  die: 'd10' | 'd8' | 'd6';
  name: 'Standard' | 'Unstable' | 'Chaotic';
}

export interface Odds {
  target: 2 | 3 | 4 | 5 | 6;
  name: 'Certain' | 'Likely' | 'Standard' | 'Unlikely' | 'Almost Impossible';
}

export interface CampaignElement {
  type: string;
  name: string;
  details?: string;
}
export interface AppState {
  currentChaos: Chaos;
  currentOdds: Odds;
  campaignElements: CampaignElement[];
}