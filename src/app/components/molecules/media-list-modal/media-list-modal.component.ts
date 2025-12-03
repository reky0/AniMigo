import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@components/core/services/api.service';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonDatetime, IonIcon, IonModal, IonTextarea, IonToggle } from '@ionic/angular/standalone';
import { take } from 'rxjs';

export interface MediaListEntry {
  id?: number;
  status?: string;
  score?: number | null;
  progress?: number | null;
  progressVolumes?: number | null;
  repeat?: number | null;
  private?: boolean | null;
  hiddenFromStatusLists?: boolean | null;
  notes?: string | null;
  startedAt?: { year?: number | null; month?: number | null; day?: number | null } | null;
  completedAt?: { year?: number | null; month?: number | null; day?: number | null } | null;
}

export interface MediaInfo {
  id: number;
  type: 'ANIME' | 'MANGA';
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
}

@Component({
  selector: 'am-media-list-modal',
  templateUrl: './media-list-modal.component.html',
  styleUrls: ['./media-list-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonButton,
    IonIcon,
    IonToggle,
    IonTextarea,
    IonDatetime
  ]
})
export class MediaListModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() mediaInfo?: MediaInfo;
  @Input() currentEntry?: MediaListEntry;

  @Output() closed = new EventEmitter<void>();
  @Output() entrySaved = new EventEmitter<MediaListEntry>();

  // Date picker state
  showStartDatePicker: boolean = false;
  showEndDatePicker: boolean = false;
  startDateISO: string = '';
  endDateISO: string = '';

  // Modal form data
  modalFormData: MediaListEntry = {};
  private wasOpen: boolean = false;

  constructor(private readonly apiService: ApiService) { }

  ngOnInit() {
    this.initializeFormData();
  }

  ngOnChanges() {
    // Only reinitialize when modal transitions from closed to open
    if (this.isOpen && !this.wasOpen) {
      this.initializeFormData();
    }
    this.wasOpen = this.isOpen;
  }

  private initializeFormData() {
    if (this.currentEntry && this.currentEntry.id) {
      // Entry exists, pre-fill with current data
      this.modalFormData = {
        status: this.currentEntry.status,
        score: this.currentEntry.score ?? 0,
        progress: this.currentEntry.progress ?? 0,
        progressVolumes: this.currentEntry.progressVolumes ?? 0,
        repeat: this.currentEntry.repeat ?? 0,
        private: this.currentEntry.private ?? false,
        hiddenFromStatusLists: this.currentEntry.hiddenFromStatusLists ?? false,
        notes: this.currentEntry.notes ?? '',
        startedAt: this.currentEntry.startedAt ? { ...this.currentEntry.startedAt } : undefined,
        completedAt: this.currentEntry.completedAt ? { ...this.currentEntry.completedAt } : undefined
      };
    } else {
      // Reset for new entry - set default values
      this.modalFormData = {
        status: undefined,
        score: 0,
        progress: 0,
        progressVolumes: 0,
        repeat: 0,
        private: false,
        hiddenFromStatusLists: false,
        notes: '',
        startedAt: undefined,
        completedAt: undefined
      };
    }
  }

  close() {
    this.closed.emit();
  }

  save() {
    if (!this.mediaInfo?.id) return;

    // Check if any data changed
    const hasChanges =
      this.currentEntry?.status !== this.modalFormData.status ||
      this.currentEntry?.score !== this.modalFormData.score ||
      this.currentEntry?.progress !== this.modalFormData.progress ||
      this.currentEntry?.progressVolumes !== this.modalFormData.progressVolumes ||
      this.currentEntry?.repeat !== this.modalFormData.repeat ||
      this.currentEntry?.private !== this.modalFormData.private ||
      this.currentEntry?.hiddenFromStatusLists !== this.modalFormData.hiddenFromStatusLists ||
      this.currentEntry?.notes !== this.modalFormData.notes ||
      this.hasDateChanged(this.currentEntry?.startedAt ?? undefined, this.modalFormData.startedAt ?? undefined) ||
      this.hasDateChanged(this.currentEntry?.completedAt ?? undefined, this.modalFormData.completedAt ?? undefined);

    if (!hasChanges && this.currentEntry) {
      this.close();
      return;
    }

    // Convert null to undefined for API
    const convertDate = (date?: { year?: number | null; month?: number | null; day?: number | null } | null) => {
      if (!date) return undefined;
      return {
        year: date.year ?? undefined,
        month: date.month ?? undefined,
        day: date.day ?? undefined
      };
    };

    this.apiService.saveMediaListEntry({
      mediaId: this.mediaInfo.id,
      status: this.modalFormData.status as any,
      score: this.modalFormData.score ?? undefined,
      progress: this.modalFormData.progress ?? undefined,
      progressVolumes: this.modalFormData.progressVolumes ?? undefined,
      repeat: this.modalFormData.repeat ?? undefined,
      private: this.modalFormData.private ?? undefined,
      hiddenFromStatusLists: this.modalFormData.hiddenFromStatusLists ?? undefined,
      notes: this.modalFormData.notes ?? undefined,
      startedAt: convertDate(this.modalFormData.startedAt),
      completedAt: convertDate(this.modalFormData.completedAt)
    }).pipe(take(1)).subscribe({
      next: (response) => {
        this.entrySaved.emit(response.data);
        this.close();
      },
      error: (error) => {
        console.error('Failed to save media list entry:', error);
      }
    });
  }

  setModalStatus(status: 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING') {
    this.modalFormData.status = status;
  }

  // Counter methods
  incrementProgress() {
    const current = this.modalFormData.progress || 0;
    const max = this.mediaInfo?.type === 'ANIME' ? this.mediaInfo?.episodes : this.mediaInfo?.chapters;
    if (max && current >= max) return;
    this.modalFormData.progress = current + 1;
  }

  decrementProgress() {
    const current = this.modalFormData.progress || 0;
    if (current <= 0) return;
    this.modalFormData.progress = current - 1;
  }

  validateProgress() {
    const max = this.mediaInfo?.type === 'ANIME' ? this.mediaInfo?.episodes : this.mediaInfo?.chapters;
    const current = this.modalFormData.progress || 0;

    if (current < 0) {
      this.modalFormData.progress = 0;
    } else if (max && current > max) {
      this.modalFormData.progress = max;
    }
  }

  incrementVolumes() {
    const current = this.modalFormData.progressVolumes || 0;
    const max = this.mediaInfo?.volumes;
    if (max && current >= max) return;
    this.modalFormData.progressVolumes = current + 1;
  }

  decrementVolumes() {
    const current = this.modalFormData.progressVolumes || 0;
    if (current <= 0) return;
    this.modalFormData.progressVolumes = current - 1;
  }

  validateVolumes() {
    const max = this.mediaInfo?.volumes;
    const current = this.modalFormData.progressVolumes || 0;

    if (current < 0) {
      this.modalFormData.progressVolumes = 0;
    } else if (max && current > max) {
      this.modalFormData.progressVolumes = max;
    }
  }

  incrementScore() {
    const current = this.modalFormData.score || 0;
    if (current >= 10) return;
    this.modalFormData.score = current + 1;
  }

  decrementScore() {
    const current = this.modalFormData.score || 0;
    if (current <= 0) return;
    this.modalFormData.score = current - 1;
  }

  incrementRepeat() {
    const current = this.modalFormData.repeat || 0;
    this.modalFormData.repeat = current + 1;
  }

  decrementRepeat() {
    const current = this.modalFormData.repeat || 0;
    if (current <= 0) return;
    this.modalFormData.repeat = current - 1;
  }

  deleteEntry() {
    if (!this.currentEntry?.id) {
      return;
    }

    this.apiService.deleteMediaListEntry(this.currentEntry.id).pipe(take(1)).subscribe({
      next: () => {
        this.entrySaved.emit(undefined);
        this.close();
      },
      error: (error) => {
        console.error('Failed to delete entry:', error);
      }
    });
  }

  // Date picker methods
  openStartDatePicker() {
    const date = this.modalFormData.startedAt;
    if (date?.year && date?.month && date?.day) {
      this.startDateISO = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      this.startDateISO = new Date().toISOString();
    }
    this.showStartDatePicker = true;
  }

  openEndDatePicker() {
    const date = this.modalFormData.completedAt;
    if (date?.year && date?.month && date?.day) {
      this.endDateISO = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      this.endDateISO = new Date().toISOString();
    }
    this.showEndDatePicker = true;
  }

  onStartDateChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      const date = new Date(isoDate);
      this.modalFormData.startedAt = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    }
  }

  onEndDateChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      const date = new Date(isoDate);
      this.modalFormData.completedAt = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
    }
  }

  clearStartDate() {
    this.modalFormData.startedAt = undefined;
    this.startDateISO = '';
    this.showStartDatePicker = false;
  }

  clearEndDate() {
    this.modalFormData.completedAt = undefined;
    this.endDateISO = '';
    this.showEndDatePicker = false;
  }

  getStartDateLabel(): string {
    const date = this.modalFormData.startedAt;
    if (date?.year && date?.month && date?.day) {
      return `${date.month}/${date.day}/${date.year}`;
    }
    return 'Start date';
  }

  getEndDateLabel(): string {
    const date = this.modalFormData.completedAt;
    if (date?.year && date?.month && date?.day) {
      return `${date.month}/${date.day}/${date.year}`;
    }
    return 'End date';
  }

  hasDateChanged(
    date1?: { year?: number | null; month?: number | null; day?: number | null },
    date2?: { year?: number | null; month?: number | null; day?: number | null }
  ): boolean {
    if (!date1 && !date2) return false;
    if (!date1 || !date2) return true;
    return date1.year !== date2.year ||
           date1.month !== date2.month ||
           date1.day !== date2.day;
  }
}
