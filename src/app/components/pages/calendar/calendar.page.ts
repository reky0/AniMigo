import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { ToastService } from '@components/core/services/toast.service';
import { IonBackButton, IonCol, IonContent, IonGrid, IonHeader, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GET_AIRING_SCHEDULES } from 'src/app/models/aniList/mediaQueries';
import { AiringSchedule } from 'src/app/models/aniList/responseInterfaces';
import { RangePipe } from "../../../helpers/range.pipe";

@Component({
  selector: 'am-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonCol, IonRow, CatalogItemComponent, IonSegment, IonSegmentButton, RangePipe]
})
export class CalendarPage implements OnInit, OnDestroy {

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) { }

  now = new Date();
  jsDay = this.now.getDay();
  weekdayNumber = this.jsDay === 0 ? 7 : this.jsDay;

  airingSchedules: AiringSchedule[] | undefined;
  loading: boolean = true;

  private destroy$ = new Subject<void>();
  private cancelRequest$ = new Subject<void>();

  loadedData: Array<AiringSchedule[] | null> = [null, null, null, null, null, null, null, null];

  ngOnInit() {
    this.toastService.setTabBarVisibility(false);
    this.fetchAiringSchedules(this.weekdayNumber);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelRequest$.complete();
  }

  fetchAiringSchedules(day: number) {
    this.weekdayNumber = day;

    if (this.loadedData[this.weekdayNumber]) {
      this.airingSchedules = this.loadedData[this.weekdayNumber]!;
      this.loading = false;
      return;
    }

    // Cancel any ongoing request
    this.cancelRequest$.next();

    this.loading = true;
    this.airingSchedules = undefined;

    const ts = getWeekdayTimestamps(this.weekdayNumber);
    const variables = {
      from: ts.from,
      to: ts.to
    };

    this.apiService.fetchAiringSchedules(GET_AIRING_SCHEDULES, variables, true, this.authService.getUserData()?.options?.displayAdultContent).pipe(
      take(1), // Only take the first emission to avoid multiple updates
      takeUntil(this.cancelRequest$),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        this.airingSchedules = result.data?.Page.airingSchedules;
        this.loadedData[this.weekdayNumber] = this.airingSchedules || null;
        this.loading = result.loading;
      },
      error: (error) => {
        console.error('Error fetching airing schedules:', error);
        this.loading = false;
      }
    });
  }

  goToDetails(id: number, isAdult: boolean | null | undefined) {
    if (isAdult && !this.authService.getUserData()?.options?.displayAdultContent) {
      this.showErrorToast("Oops, your settings don't allow me to show you that! (Adult content warning)")
    } else {
      this.router.navigate(['/media', 'anime', id]);
    }
  }

  private async showErrorToast(message: string) {
    // Use ToastService with alerts for reliable notifications
    await this.toastService.error(message);
  }

}

export function getWeekdayTimestamps(weekday: number): { from: number; to: number } {
  if (weekday < 1 || weekday > 7) {
    throw new Error('Weekday must be between 1 (Monday) and 7 (Sunday)');
  }

  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // JS Sunday(0) -> 7
  const diff = weekday - currentDay;

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  startOfDay.setDate(now.getDate() + diff);

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    from: Math.floor(startOfDay.getTime() / 1000),
    to: Math.floor(endOfDay.getTime() / 1000),
  };
}
