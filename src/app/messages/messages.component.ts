import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  // it must be public because it is being binded(sticked together) in the template
  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

}
