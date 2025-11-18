import { Component, Input, OnInit } from '@angular/core';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { ChartBarComponent } from "@components/molecules/chart-bar/chart-bar.component";
import { IonCol, IonGrid, IonRow, IonText, IonTitle } from "@ionic/angular/standalone";
import { toSentenceCase } from 'src/app/helpers/utils';
import { DetailedMedia, ScoreStat, StatusStat } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'am-stats-tab',
  templateUrl: './stats-tab.component.html',
  styleUrls: ['./stats-tab.component.scss'],
  imports: [IonGrid, IonRow, IonCol, IonText, SectionTitleComponent, InfoChipComponent, ChartBarComponent, IonTitle],
})
export class StatsTabComponent implements OnInit {
  @Input() data: DetailedMedia | null | undefined;
  @Input() loading: boolean = true;

  toSentenceCase = toSentenceCase;

  constructor() { }

  totalStatus: number = 0;
  maxScoreAmount: number = 0;
  maxStatusAmount: number = 0;

  coloredStatus: Array<StatusStat> = Array();
  coloredScores: Array<ScoreStat> = Array();

  ngOnInit() {
    const statusColors = [
      ["var(--custom-color-current)", "white"], // current - soft green
      ["var(--custom-color-planning)", "#222"], // planning - soft gray
      ["var(--custom-color-completed)", "white"], // completed - sky blue
      ["var(--custom-color-dropped)", "white"], // dropped - soft red
      ["var(--custom-color-paused)", "#222"], // paused - gentle amber
      ["var(--custom-color-repeating)", "white"], // repeating - soft lavender
    ];

    const scoreColors = [
      "#EF6C6C", // 10 - soft red (danger)
      "#F5927E", // 20 - coral-red blend
      "#F29079", // 30 - brand coral/secondary
      "#F5A591", // 40 - light coral
      "#FFB74D", // 50 - gentle amber (warning)
      "#B794F6", // 60 - soft lavender (accent-purple)
      "#7EA8E8", // 70 - sky blue (tertiary)
      "#5DC6C4", // 80 - soft teal (accent-teal)
      "#6BCF8E", // 90 - soft green (success)
      "#5D8FDD"  // 100 - brand blue (primary)
    ];

    if (this.data?.stats) {

      for (let i = 0; i < this.data.stats.scoreDistribution.length; i++) {
        let coloredScore: ScoreStat = { ...this.data.stats.scoreDistribution[i], color: scoreColors[i] }

        this.coloredScores.push(coloredScore);
      }

      for (let i = 0; i < this.data.stats.statusDistribution.length; i++) {
        let coloredStatus: StatusStat = { ...this.data.stats.statusDistribution[i], color: statusColors[i][0], textColor: statusColors[i][1] }

        this.coloredStatus.push(coloredStatus);
      }

      this.totalStatus = this.data?.stats.statusDistribution.reduce((sum, item) => sum + item.amount, 0)
      this.maxScoreAmount = Math.max(...this.data.stats.scoreDistribution.map(item => item.amount))
      this.maxStatusAmount = Math.max(...this.data.stats.statusDistribution.map(item => item.amount))
    }
  }
}
