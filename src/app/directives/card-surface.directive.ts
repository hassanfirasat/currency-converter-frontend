import { Directive, HostBinding, Input } from '@angular/core';

type ElevationLevel = 'flat' | 'low' | 'medium' | 'high';

@Directive({
  selector: '[appCardSurface]',
  standalone: true,
})
export class CardSurfaceDirective {
  private elevation: ElevationLevel = 'medium';

  @Input('appCardSurface')
  set level(level: ElevationLevel | '' | undefined) {
    this.elevation = this.normalize(level);
  }

  @HostBinding('class.card-surface')
  baseClass = true;

  @HostBinding('class.mat-elevation-z0')
  get flatElevation(): boolean {
    return this.elevation === 'flat';
  }

  @HostBinding('class.mat-elevation-z2')
  get lowElevation(): boolean {
    return this.elevation === 'low';
  }

  @HostBinding('class.mat-elevation-z4')
  get mediumElevation(): boolean {
    return this.elevation === 'medium';
  }

  @HostBinding('class.mat-elevation-z8')
  get highElevation(): boolean {
    return this.elevation === 'high';
  }

  private normalize(level: ElevationLevel | '' | undefined): ElevationLevel {
    if (level === 'flat' || level === 'low' || level === 'medium' || level === 'high') {
      return level;
    }
    return 'medium';
  }
}
