import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { user } from '../interfaces/userInterface';
import { CommunicationService } from './communication.service';
import { SceneService } from './scene.service';


@Injectable({
  providedIn: 'root'
})
export class CharacterLoaderService {
  private fbxLoader = new FBXLoader();
  public mixer: any
  userData = {} as user;
  
  public character: any
  private characterLoader: Subject<boolean> = new Subject<boolean>();
  public characterObservable = this.characterLoader.asObservable();
  animationAction: any;
  constructor(private communicationService: CommunicationService, private sceneService: SceneService) { }

  loadNewCharacter(){
    this.characterLoader.next(false)
    this.fbxLoader.load(
      'assets/avatar.fbx',
      (object) => {
        object.scale.set(0.3, 0.3, 0.3);
        this.character = object;
        this.userData.Id = this.communicationService.userId;
        this.userData.UserName = this.communicationService.userName;
        this.userData.Position = this.character.position;
        this.communicationService.sendMessage(this.userData);
        this.characterLoader.next(true)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )
  }

  // loadOthers(user: user){
  //   // this.characterLoader.next(false)
  //   this.fbxLoader.load(
  //     'assets/avatar.fbx',
  //     (object) => {
  //       object.scale.set(0.3, 0.3, 0.3);
  //       // this.character = object;
  //       object.name = user.Id;
  //       this.sceneService.scene.add(object);

  //       // this.userData.Position = this.character.position;
  //       // this.communicationService.sendMessage(this.userData);
  //       // this.characterLoader.next(true)
  //     },
  //     (xhr) => {
  //       console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  //     },
  //     (error) => {
  //       console.log(error)
  //     }
  //   )
  // }


}
