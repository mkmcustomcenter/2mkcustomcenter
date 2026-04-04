import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent implements OnInit {
  logoMoved = false;

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.hideHeader();
  }

  onEnterClick(): void {
    this.headerService.showHeader();
    this.logoMoved = true;
  }
}