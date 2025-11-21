import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConversionHistoryService } from '../../services/conversion-history.service';
import { ConversionRecord } from '../../models/currency.models';
import { CardSurfaceDirective } from '../../directives/card-surface.directive';

@Component({
  selector: 'app-conversion-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    CardSurfaceDirective,
  ],
  templateUrl: './conversion-history.component.html',
  styleUrl: './conversion-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionHistoryComponent {
  private readonly historyService = inject(ConversionHistoryService);

  protected readonly history$ = this.historyService.history$;

  protected clearHistory(): void {
    this.historyService.clear();
  }

  protected trackRecord(_index: number, record: ConversionRecord): string {
    return record.id;
  }
}
