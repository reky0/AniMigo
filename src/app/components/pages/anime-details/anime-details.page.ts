import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSkeletonText, IonText, IonImg, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@components/core/services/api-service';
import { GET_MEDIA_BY_ID } from 'src/app/models/aniList/mediaQueries';
import { DetailedMedia } from 'src/app/models/aniList/responseInterfaces';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.page.html',
  styleUrls: ['./anime-details.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSkeletonText, IonText, IonGrid]
})
export class AnimeDetailsPage implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  loading = true;
  error: any;
  data: DetailedMedia | null | undefined = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");

    console.log("ANIME ID: " + Number(id));

    let variables = {
      id: Number(id),
      type: "ANIME"
    };
    
    this.apiService.fetchDetailedData(GET_MEDIA_BY_ID, variables).subscribe({
          next: ({ data, loading, errors }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0];
            } else {
              this.data = data?.Media;
              // console.log(this.data);
              // console.log(this.data?.description);
              
            }
          },
          error: (err) => {
            this.error = err;
            this.loading = false;
          }
        });
  }

}
