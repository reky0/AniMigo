import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '@components/core/services/auth.service';
import { IonicModule } from "@ionic/angular";
import { marked } from 'marked';
import { getPreferredCharacterName } from 'src/app/helpers/utils';
import { Character, Staff } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'am-people-info-tab',
  templateUrl: './people-info-tab.component.html',
  styleUrls: ['./people-info-tab.component.scss'],
  imports: [
    IonicModule,
    DatePipe
  ],
})

export class PeopleInfoTabComponent implements OnInit {
  @Input() data: Character | Staff | undefined;
  @Input() loading: boolean = true;

  getPreferredCharacterName = getPreferredCharacterName;
  showSpoilerNames = false;
  birthdate: Date | null = new Date(1, 0, 1);
  parsedDescription: SafeHtml | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    public readonly authService: AuthService
  ) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.dateOfBirth && this.data.dateOfBirth.day && this.data.dateOfBirth.month) {
        this.birthdate = new Date(this.data.dateOfBirth.year ?? new Date().getFullYear(), this.data.dateOfBirth.month - 1, this.data.dateOfBirth.day)
      } else {
        this.birthdate = null;
      }

      if (this.data.description) {
        this.parsedDescription = this.sanitizer.bypassSecurityTrustHtml(marked(this.data.description) as string);
      } else {
        this.parsedDescription = this.sanitizer.bypassSecurityTrustHtml("<p>No description available.</p>");
      }
    }
  }

  toggleShowSpoilerNames() {
    this.showSpoilerNames = !this.showSpoilerNames;
  }

  isCharacter(data: Character | Staff | undefined): data is Character {
    return !!data && 'alternativeSpoiler' in (data as Character).name;
  }
}
