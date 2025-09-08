import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-random-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './random-events.component.html',
  styleUrl: './random-events.component.css',
})
export class RandomEventsComponent {
  private s = inject(StateService);
  state$ = this.s.state$;

  // Step results
  focusRoll: number | null = null;
  focusResult = '';          // e.g., "Progress", "Setback"
  focusDescription = '';     // e.g., "Something advances..."

  subjectText = '';          // e.g., "Prototype Starship" or "Arix the Scout (Character)"
  subjectIsFromElements = false;

  meaning1 = '';
  meaning2 = '';

  // Tables (adapted from your original)
  private eventFocusTable = [
    { roll: [1, 2], result: 'Progress', description: 'Something advances or moves forward' },
    { roll: [3, 4], result: 'Setback', description: 'Something is hindered, delayed, or goes wrong' },
    { roll: [5],    result: 'New Element', description: 'Add something new to the scene/campaign' },
    { roll: [6],    result: 'Lose Element', description: 'Remove or diminish an existing element' },
  ];

  private subjectTable = [
    'Mining Colony', 'Prototype Starship', 'Colonist Uprising', 'Trade Route', 'Ancient Ruins',
    'Corporate Agent', 'Pirate Fleet', 'Research Station', 'Alien Artifact', 'Diplomatic Envoy',
    'Mercenary Band', 'Supply Cache', 'Communication Array', 'Rebel Cell', 'Noble House',
    'Mysterious Signal', 'Derelict Ship', 'Orbital Platform', 'Underground Movement', 'Tech Smugglers',
    'Religious Sect', 'AI Network', 'Quarantine Zone', 'Black Market', 'Military Patrol'
  ];

  private meaningWords = [
    'Abandon','Abuse','Accident','Achieve','Activity','Advantage','Advice','Agree',
    'Ambush','Arrive','Assist','Attach','Attempt','Attract','Bargain','Bestow',
    'Betray','Block','Break','Carry','Celebrate','Change','Chaos','Communicate',
    'Compete','Conflict','Control','Create','Cruelty','Danger','Death','Deceive',
    'Delay','Demand','Destroy','Develop','Dispute','Disrupt','Dominate','Emotion',
    'Escape','Excitement','Expose','Extravagance','Failure','Fame','Fantasy','Fear',
    'Fight','Focus','Freedom','Friendship','Goals','Gratitude','Greed','Grief',
    'Hate','Heal','Hire','Hope','Horror','Idea','Illness','Imitate','Imprison',
    'Information','Injury','Inspect','Intelligence','Intimidate','Join','Journey',
    'Judge','Kill','Knowledge','Language','Leadership','Learn','Legal','Light',
    'Listen','Love','Magic','Military','Money','Mystery','Nature','Neglect',
    'News','Object','Oppress','Overthrow','Pain','Peace','Persecute','Plan',
    'Postpone','Power','Praise','Prison','Propose','Protect','Punish','Puzzle',
    'Recruit','Refuse','Release','Represent','Rescue','Revenge','Reward','Rumor',
    'Secret','Separate','Stop','Strange','Struggle','Success','Surprise','Surround',
    'Technology','Threaten','Transform','Travel','Trust','Trick','Victory','Violence'
  ];

  // --- Actions ---
  rollEventFocus() {
    const d6 = this.rollDie(6);
    this.focusRoll = d6;

    const entry = this.eventFocusTable.find(e => e.roll.includes(d6));
    if (entry) {
      this.focusResult = entry.result;
      this.focusDescription = entry.description;
    } else {
      this.focusResult = '';
      this.focusDescription = '';
    }
  }

  generateSubject() {
    this.subjectIsFromElements = false;
    this.subjectText = this.pick(this.subjectTable);
  }

  useRandomElement() {
    const list = this.s.snapshot.campaignElements;
    if (!list.length) {
      this.subjectIsFromElements = false;
      this.subjectText = ''; // show empty state in UI
      return;
    }
    const el = this.pick(list);
    this.subjectIsFromElements = true;
    this.subjectText = el.details ? `${el.name} (${el.type}) — ${el.details}` : `${el.name} (${el.type})`;
  }

  rollEventMeaning() {
    this.meaning1 = this.pick(this.meaningWords);
    do {
      this.meaning2 = this.pick(this.meaningWords);
    } while (this.meaning2 === this.meaning1); // ensure two different words
  }

  clearEventResults() {
    this.focusRoll = null;
    this.focusResult = '';
    this.focusDescription = '';

    this.subjectIsFromElements = false;
    this.subjectText = '';

    this.meaning1 = '';
    this.meaning2 = '';
  }

  // Derived interpretation helper (used in template)
  get hasAllParts(): boolean {
    return !!(this.focusResult && this.subjectText && this.meaning1 && this.meaning2);
  }

  // --- Helpers ---
  private rollDie(sides: number) {
    return Math.floor(Math.random() * sides) + 1;
  }
  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  rollAll() {
    this.rollEventFocus();
    // Prefer campaign element if you have any; else random subject
    if (this.s.snapshot.campaignElements.length) {
      this.useRandomElement();
    } else {
      this.generateSubject();
    }
    this.rollEventMeaning();
  }
copyInterpretation() {
  const lines = [
    `🎯 Event Interpretation`,
    `Focus: ${this.focusResult} — ${this.focusDescription}`,
    `Subject: ${this.subjectText}`,
    `Meaning: ${this.meaning1} + ${this.meaning2}`,
  ];
  navigator.clipboard.writeText(lines.join('\n')).catch(()=>{});
}
}
