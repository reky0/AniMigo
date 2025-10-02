import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonText, IonItem, IonList, IonCol } from '@ionic/angular/standalone';
import { PlatformService } from '@components/core/services/platform-service';
import { SectionHeaderComponent } from "@components/molecules/section-header/section-header.component";
import { CatalogItemComponent } from "@components/atoms/catalog-item/catalog-item.component";

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
  standalone: true,
  imports: [IonList, IonContent, IonTitle, IonToolbar, CommonModule, FormsModule, IonHeader, SectionHeaderComponent, CatalogItemComponent, IonCol]
})
export class HomeTabPage implements OnInit {
  platformService: PlatformService = inject(PlatformService);
  trendingAnimes = [
    { _id: 1, title: "Naruto", image: "https://cdn.myanimelist.net/images/anime/13/17405.jpg", rating: 20 },
    { _id: 2, title: "One Piece", image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg", rating: 25 },
    { _id: 3, title: "Attack on Titan", image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg", rating: 30 },
    { _id: 4, title: "My Hero Academia", image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg", rating: 22 },
    { _id: 5, title: "Demon Slayer", image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg", rating: 28 }
  ];

  nextSeasonAnimes = [
    { _id: 1, title: "Jujutsu Kaisen 2nd Season", image: "https://cdn.myanimelist.net/images/anime/1171/132317.jpg"},
    { _id: 2, title: "Attack on Titan Final Season Part 3", image: "https://cdn.myanimelist.net/images/anime/1986/132317.jpg"},
    { _id: 3, title: "Bleach: Thousand-Year Blood War", image: "https://cdn.myanimelist.net/images/anime/1517/132317.jpg"},
    { _id: 4, title: "The Rising of the Shield Hero Season 3", image: "https://cdn.myanimelist.net/images/anime/1900/132317.jpg"},
    { _id: 5, title: "Demon Slayer: Swordsmith Village Arc", image: "https://cdn.myanimelist.net/images/anime/1286/132317.jpg" }
  ];

  trendingMangas = [
    { _id: 1, title: "Berserk", image: "https://cdn.myanimelist.net/images/manga/3/157897.jpg", rating: 18 },
    { _id: 2, title: "Death Note", image: "https://cdn.myanimelist.net/images/manga/2/243146.jpg", rating: 24 },
    { _id: 3, title: "One Piece", image: "https://cdn.myanimelist.net/images/manga/3/54021.jpg", rating: 29 },
    { _id: 4, title: "Naruto", image: "https://cdn.myanimelist.net/images/manga/3/117681.jpg", rating: 21 },
    { _id: 5, title: "Attack on Titan", image: "https://cdn.myanimelist.net/images/manga/2/37865.jpg", rating: 27 }
  ];

  newlyAddedAnimes = [
    { _id: 1, title: "Chainsaw Man", image: "https://cdn.myanimelist.net/images/anime/3/232176.jpg"},
    { _id: 2, title: "Spy x Family", image: "https://cdn.myanimelist.net/images/anime/3/232175.jpg"},
    { _id: 3, title: "Jujutsu Kaisen", image: "https://cdn.myanimelist.net/images/anime/3/232174.jpg"},
    { _id: 4, title: "Tokyo Revengers", image: "https://cdn.myanimelist.net/images/anime/3/232173.jpg"},
    { _id: 5, title: "Demon Slayer: Kimetsu no Yaiba", image: "https://cdn.myanimelist.net/images/anime/3/232172.jpg" }
  ];

  newlyAddedMangas = [
    { _id: 1, title: "Chainsaw Man", image: "https://cdn.myanimelist.net/images/manga/3/232176.jpg"},
    { _id: 2, title: "Spy x Family", image: "https://cdn.myanimelist.net/images/manga/3/232175.jpg"},
    { _id: 3, title: "Jujutsu Kaisen", image: "https://cdn.myanimelist.net/images/manga/3/232174.jpg"},
    { _id: 4, title: "Tokyo Revengers", image: "https://cdn.myanimelist.net/images/manga/3/232173.jpg"},
    { _id: 5, title: "Demon Slayer: Kimetsu no Yaiba", image: "https://cdn.myanimelist.net/images/manga/3/232172.jpg" }
  ];

  constructor() { }

  ngOnInit() {

  }
}
