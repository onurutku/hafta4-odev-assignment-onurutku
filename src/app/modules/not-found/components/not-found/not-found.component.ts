import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    //a tiemr for redirect to shop Page
    setTimeout(() => {
      this.router.navigate(['/shop']);
    }, 3000);
  }
}
