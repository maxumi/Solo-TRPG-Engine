import { Injectable } from '@angular/core';
import { AppState, CampaignElement, Chaos, Odds } from '../model';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'oracleEventApp_v1';

const DEFAULT_STATE: AppState = {
  currentChaos: { die: 'd10', name: 'Standard' },
  currentOdds: { target: 4, name: 'Standard' },
  campaignElements: []
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private stateSubject = new BehaviorSubject<AppState>(this.loadState());
  readonly state$: Observable<AppState> = this.stateSubject.asObservable();

  /** Current state snapshot */
  get snapshot(): AppState {
    return this.stateSubject.value;
  }

  /** Replace whole state */
  setState(newState: AppState): void {
    this.patch({ ...newState });
  }

  /** Reset everything */
  resetState(): void {
    this.patch({ ...DEFAULT_STATE });
  }

  // ---- chaos/odds ----
  setChaos(chaos: Chaos) {
    this.patch({ ...this.snapshot, currentChaos: chaos });
  }

  setOdds(odds: Odds) {
    this.patch({ ...this.snapshot, currentOdds: odds });
  }

  // ---- campaign elements ----
  addElement(el: CampaignElement): void {
    const next = [...this.snapshot.campaignElements, el];
    this.patch({ ...this.snapshot, campaignElements: next });
  }

  removeElement(index: number): void {
    const next = this.snapshot.campaignElements.filter((_, i) => i !== index);
    this.patch({ ...this.snapshot, campaignElements: next });
  }

  replaceElements(elems: CampaignElement[]): void {
    this.patch({ ...this.snapshot, campaignElements: elems });
  }

  clearElements(): void {
    this.patch({ ...this.snapshot, campaignElements: [] });
  }

  // ---- internal: emit + persist in one place ----
  private patch(nextState: AppState): void {
    this.stateSubject.next(nextState);
    this.saveState(nextState);
  }

  // ---- persistence ----
  private saveState(state: AppState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota/security errors */
    }
  }

  private loadState(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppState) : { ...DEFAULT_STATE };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }
}
