import {Component, OnInit} from '@angular/core';
import {AwarenessService} from "../../../services/awareness.service";
import {User} from "../../../models/User.model";

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html'
})
export class CompositeComponent implements OnInit{

  Users: User[] = [];
  FilterUser: User = new User;

  constructor(public awareness: AwarenessService) { }

  ngOnInit(): void {
    this.loadComposite()
  }

  loadComposite() {
    const user1: { user_email: string; user_name: string; _id: string, user_role: any } = {
      _id: "",
      user_name: "Jane Doew",
      user_email: "Jane Doew",
      user_role: 1,
    };

    const newUser1: User = new User();
    newUser1._id = "1";
    newUser1.user_name = "John Smith";
    newUser1.user_email = "john@example.com";
    newUser1.user_password = "password123";

    const newUser2: User = new User();
    newUser2._id = "1";
    newUser2.user_name = "John Smith";
    newUser2.user_email = "john@example.com";
    newUser2.user_password = "password123";

    this.FilterUser.acquireComposite((Users: User[]) => {
      this.Users = Users;
      this.Users.push(newUser1);
      this.Users.push(newUser2);

    }, (error: any) => {
      // TODO! Handle errors
      console.log("Error", error);
    });
  }


}
