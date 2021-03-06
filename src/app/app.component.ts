import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  route: String = 'recipes';

  navigate(route: String) {
    this.route = route;
  }
}
