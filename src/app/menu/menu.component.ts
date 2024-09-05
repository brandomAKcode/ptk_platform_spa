import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { UserResponse } from '../user-response';
import { PTKDealerApiService } from '../ptk-api.service';
import { OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { PTKStorageService } from '../ptk-storage.service';


interface Rotation {
  id: number,
  pending: boolean,
  date: string,
  user: number
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  @Input() user: UserResponse | null = null;
  rotation_pending: boolean = false;
  user_role: string = 'DEA';

  constructor(
    private ptkDealerApi: PTKDealerApiService,
    private ptkStorage: PTKStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRotationPending();
    this.user_role = localStorage.getItem('user_role')!;
  }

  getRotationPending(): void {
    this.ptkDealerApi.request(this.ptkDealerApi.getRotationPending())
      .then((result) => {
        this.rotation_pending = Object.keys((result as Rotation | {})).length > 0 ? true : false;
      }).catch((error) => {
        this.ptkDealerApi.delayRetrying().subscribe(
          {
            next: (data) => {
              console.log('Retrying');
              this.getRotationPending();
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => console.info('complete')
          }
        );
      });
  }

  logout(): void {
    this.ptkStorage.clearStorage();
    window.location.href = '/login';
  }
}
