import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerMessage = 'Inscrivez-vous pour enregistrer votre classement !';

  constructor() { }

  ngOnInit(): void {
  }

}
