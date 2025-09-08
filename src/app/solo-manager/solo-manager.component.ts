import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppState } from './model';
import { RouterLink, RouterModule } from '@angular/router';
import { StateService } from './services/state.service';

const DEFAULT_STATE: AppState = {
    currentChaos: { die: 'd10', name: 'Standard' },
    currentOdds: { target: 4, name: 'Standard' },
    campaignElements: []
};

@Component({
  selector: 'app-solo-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './solo-manager.component.html',
  styleUrls: ['./solo-manager.component.css'],
})
export class SoloManagerComponent {
  private stateService = inject(StateService);

  // Observable of the state, use async pipe in template
  readonly state$ = this.stateService.state$;

  // Convenience getter for snapshot access (no subscribe)
  get state(): AppState {
    return this.stateService.snapshot;
  }

  reset() {
    this.stateService.resetState();
  }
}