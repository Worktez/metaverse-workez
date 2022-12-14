import { Injectable } from '@angular/core';
import { user } from '../interfaces/userInterface';
import * as io from 'socket.io-client';
import { CharacterLoaderService } from './character-loader.service';
import { OtherCharacterLoaderService } from './other-character-loader.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  socket: any;
  userId: string = '';
  user:any;
  userList: user[] = [];
  userIdList: string[] = [];
  userReady:boolean = false;
  userName: string ='';
  constructor(private otherCharacterLoader: OtherCharacterLoaderService) { }

  userNameUpdate(): void {
    this.userId = Math.random().toString(36).slice(2);
    this.socket = io.io(`localhost:3000?userName=${this.userId}`);
    this.socket.emit('set-user-name', this.userId);
    this.socket.on('user-list', (id: any) => {
      this.userIdList = id;
      this.userReady = true;
    });

    this.socket.on('message-broadcast', (data: {message: user, id: string}) => {
      if (data) {
        let found = false;
        this.userList.forEach(element => {
          console.log(element.Id, data.id);
          if(element.Id == data.id)
          {
            element.Position = data.message.Position;
            found = true;
            console.log(data.message, data.message.Position.X, data.message.Position.x);
            
            this.otherCharacterLoader.updateCharacterPosition(data.message);
          }
        });
        if(!found)
        {
          this.userList.push(data.message);
          this.otherCharacterLoader.loadOthers(data.message)
        }
        console.log(this.userList);
        
      }
    });
}
sendMessage(data: user): void {
  this.socket.emit('message', data);
  // this.messageList.push({message: this.message, userName: this.userName, mine: true});
  // this.message = '';
}
}
