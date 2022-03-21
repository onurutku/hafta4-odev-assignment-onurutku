import { Component, OnInit } from '@angular/core';
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { UserLoggedIn } from 'src/app/shared/models/userLoggedIn.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  userLoggedIn: UserLoggedIn;

  //fontawesome variables
  faFaceBook = faFacebook;
  faTwitter = faTwitter;
  faInsta = faInstagram;
  faTube = faYoutube;
  faCopyRight = faCopyright;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userLoggedIn.subscribe((userLoggedIn: UserLoggedIn) => {
      this.userLoggedIn = userLoggedIn;
    });
  }
}
