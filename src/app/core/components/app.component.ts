import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'HomeWork4-OUT';
  constructor(private auth: AuthService) {
    this.auth.autoLogin(); //auto login for each refresh page
  }
}
