import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampaignElement } from '../../model';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-element-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './element-list.component.html',
  styleUrl: './element-list.component.css'
})
export class ElementListComponent {
  private s = inject(StateService);
  state$ = this.s.state$;

  // bound form values
  elementTypes = ['Character', 'Location', 'Thread', 'Item', 'Other'];
  newType = this.elementTypes[0];
  newName = '';
  newDetails = '';

  importText = '';
  importError = '';

  addElement() {
    if (!this.newType || !this.newName) return;

    const element: CampaignElement = {
      type: this.newType,
      name: this.newName,
      details: this.newDetails || undefined,
    };

    this.s.addElement(element);
    this.newType = this.elementTypes[0];
    this.newName = '';
    this.newDetails = '';
  }

  deleteElement(i: number) {
    this.s.removeElement(i);
  }
    clearAll() {
    if (confirm('This will remove all elements. Continue?')) {
      this.s.clearElements();
    }
  }

  importFromText() {
    this.importError = '';
    if (!this.importText.trim()) return;

    try {
      const parsed = JSON.parse(this.importText);
      const normalized = this.normalizeToElements(parsed);
      if (!normalized.length) {
        this.importError = 'No valid elements found in JSON.';
        return;
      }
      // append to current list
      const merged = [...this.s.snapshot.campaignElements, ...normalized];
      this.s.replaceElements(merged);
      this.importText = '';
    } catch (e:any) {
      this.importError = `Invalid JSON: ${e?.message ?? e}`;
    }
  }

  async onFileSelected(ev: Event) {
    this.importError = '';
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const normalized = this.normalizeToElements(parsed);
      if (!normalized.length) {
        this.importError = 'No valid elements found in JSON file.';
        return;
      }
      const merged = [...this.s.snapshot.campaignElements, ...normalized];
      this.s.replaceElements(merged);
      input.value = ''; // reset file input
    } catch (e:any) {
      this.importError = `Could not import file: ${e?.message ?? e}`;
    }
  }

  /** Accepts:
   * 1) Array of {type, name, details?}
   * 2) Map: { "Type": [ {name,details?} | "Name" | {...} , ... ], ... }
   */
  private normalizeToElements(input: any): CampaignElement[] {
    const out: CampaignElement[] = [];

    const push = (type: string | undefined, item: any) => {
      if (item == null) return;
      let obj: any = item;
      if (typeof obj === 'string') obj = { name: obj };
      const name = String(obj.name ?? '').trim();
      if (!name) return;
      const details = obj.details != null ? String(obj.details).trim() : undefined;
      const finalType = String(type ?? obj.type ?? '').trim() || 'Other';
      out.push({ type: finalType, name, details });
    };

    if (Array.isArray(input)) {
      input.forEach((o) => push(o?.type, o));
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([type, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => push(type, v));
        } else {
          // single value under a key
          push(type, value);
        }
      });
    }
    return out;
    }

  exportToFile() {
    const elems = this.s.snapshot.campaignElements;
    if (!elems.length) {
      alert('No elements to export.');
      return;
    }

    const blob = new Blob([JSON.stringify(elems, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign-elements.json';
    a.click();

    URL.revokeObjectURL(url);
  }
}