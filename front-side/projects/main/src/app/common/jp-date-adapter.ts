import { NativeDateAdapter } from "@angular/material/core";

export class JPDateAdapter extends NativeDateAdapter {
  override getDateNames(): string[] {
    return Array.from(Array(31), (v, k) => `${k + 1}`);
  }
}