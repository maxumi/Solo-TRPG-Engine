import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yes-no',
  imports: [CommonModule],
  templateUrl: './yes-no.component.html',
  styleUrl: './yes-no.component.css'
})
export class YesNoComponent {
  private s = inject(StateService);
  state$ = this.s.state$;

  // Oracle UI state
  oracleDie: number | null = null;
  oracleChaosDie: number | null = null;
  oracleText = '';

  // Scene UI state
  sceneChaosDie: number | null = null;
  sceneText = '';

  setChaos(die: 'd10'|'d8'|'d6', name: 'Standard'|'Unstable'|'Chaotic') {
    this.s.setChaos({ die, name });
  }

  setOdds(target: 2|3|4|5|6, name: 'Certain'|'Likely'|'Standard'|'Unlikely'|'Almost Impossible') {
    this.s.setOdds({ target, name });
  }

  rollOracle() {
    const snap = this.s.snapshot;
    this.oracleDie = this.rollDie(6);
    const chaosMax = Number(snap.currentChaos.die.substring(1));
    this.oracleChaosDie = this.rollDie(chaosMax);

    const base = this.oracleDie >= snap.currentOdds.target ? 'Yes' : 'No';
    let mod = '';
    if (this.oracleChaosDie <= 2) mod = ' and...';
    else if (this.oracleChaosDie <= 4) mod = ' but...';

    const re = this.oracleDie === this.oracleChaosDie ? ' 🎲 RANDOM EVENT!' : '';
    this.oracleText = `${base}${mod}${re}`;
  }

  rollScene() {
    const snap = this.s.snapshot;
    const chaosMax = Number(snap.currentChaos.die.substring(1));
    const d = this.rollDie(chaosMax);
    this.sceneChaosDie = d;

    if (d <= 2) this.sceneText = 'Altered (Generate Random Event for details)';
    else if (d <= 4) this.sceneText = 'Interrupted (Generate Random Event for details)';
    else this.sceneText = 'Unmodified';
  }

  private rollDie(sides: number) {
    return Math.floor(Math.random() * sides) + 1;
  }
}
