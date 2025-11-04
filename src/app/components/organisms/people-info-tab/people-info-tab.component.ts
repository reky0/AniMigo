import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonicModule } from "@ionic/angular";
import { marked } from 'marked';
import { Character } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'app-people-info-tab',
  templateUrl: './people-info-tab.component.html',
  styleUrls: ['./people-info-tab.component.scss'],
  imports: [
    IonicModule,
    DatePipe
  ],
})

export class PeopleInfoTabComponent implements OnInit {
  @Input() data: Character | undefined;
  @Input() loading: boolean = true;

  showSpoilerNames = false;
  birthdate: Date = new Date(1, 0, 1);
  parsedDescription: SafeHtml | undefined;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.dateOfBirth && this.data.dateOfBirth.day && this.data.dateOfBirth.month) {
        this.birthdate = new Date(this.data.dateOfBirth.year ?? new Date().getFullYear(), this.data.dateOfBirth.month - 1, this.data.dateOfBirth.day)
      }

      this.parsedDescription = this.sanitizer.bypassSecurityTrustHtml(marked(this.data.description) as string);
    }
  }

  toggleShowSpoilerNames() {
    this.showSpoilerNames = !this.showSpoilerNames;
  }
}
