import { Component, Input, OnInit } from '@angular/core';
import { InfoChipComponent } from "@components/atoms/info-chip/info-chip.component";
import { SectionTitleComponent } from "@components/atoms/section-title/section-title.component";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { heartOutline, starOutline } from 'ionicons/icons';
import { toSentenceCase } from 'src/app/helpers/utils';
import { DetailedMedia, ScoreStat, StatusStat } from 'src/app/models/aniList/responseInterfaces';
import { ChartBarComponent } from "@components/molecules/chart-bar/chart-bar.component";

@Component({
  selector: 'app-stats-tab',
  templateUrl: './stats-tab.component.html',
  styleUrls: ['./stats-tab.component.scss'],
  imports: [IonGrid, IonRow, IonCol, IonText, SectionTitleComponent, InfoChipComponent, ChartBarComponent],
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
    addIcons({ starOutline, heartOutline })

    const statusColors = [
      ["#46e267", "#222"], // current
      ["#89938b", "white"], // planning
      ["#a7c8fe", "#222"], // completed
      ["#feb3ac", "#222"], // dropped
      ["#e9c206", "#222"], // paused
    ];

    const scoreColors = [
      "#f8b4b4", // 10 - soft red
      "#f7c3a2", // 20 - light reddish-orange
      "#f6d390", // 30 - peachy orange
      "#f5e38b", // 40 - soft yellow-orange
      "#f3f38a", // 50 - light yellow
      "#d6ee93", // 60 - yellow-green
      "#b8e89d", // 70 - pastel green
      "#9be2a8", // 80 - light green
      "#7edcb3", // 90 - mint green
      "#61d6be"  // 100 - soft green
    ];

    if (this.data?.stats) {

      for (let i = 0; i < this.data.stats.scoreDistribution.length; i++) {
        let coloredScore: ScoreStat = { ...this.data.stats.scoreDistribution[i], color: scoreColors[i] }

        this.coloredScores.push(coloredScore);
      }
      console.log(this.coloredScores);

      for (let i = 0; i < this.data.stats.statusDistribution.length; i++) {
        let coloredStatus: StatusStat = { ...this.data.stats.statusDistribution[i], color: statusColors[i][0], textColor: statusColors[i][1] }

        this.coloredStatus.push(coloredStatus);
      }
      console.log(this.coloredStatus);

      this.totalStatus = this.data?.stats.statusDistribution.reduce((sum, item) => sum + item.amount, 0)
      this.maxScoreAmount = Math.max(...this.data.stats.scoreDistribution.map(item => item.amount))
      this.maxStatusAmount = Math.max(...this.data.stats.statusDistribution.map(item => item.amount))
    }
  }
}
