import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppState } from './model';

@Component({
  selector: 'app-solo-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solo-manager.component.html',
  styleUrls: ['./solo-manager.component.css'],
})
export class SoloManagerComponent {
  defaultState: AppState = {
    currentChaos: { die: 'd10', name: 'Standard' },
    currentOdds: { target: 4, name: 'Standard' },
    campaignElements: []
};
}