import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SoloManagerComponent } from './solo-manager/solo-manager.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'solo-project';
}
