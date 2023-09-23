import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showPassword = false;
  visible = false;
  login: boolean = false;
  userData: any;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    sessionStorage.clear();
  }

  registrationForm = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    userAge: [, [Validators.required, Validators.min(1)]],
    id: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    userPassword: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', [Validators.required]],
    isActive: [false]
  })

  loginForm = this.fb.group({
    id: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    userPassword: ['', [Validators.required, Validators.minLength(6)]],
  })

  registerUser() {
    if (this.registrationForm.valid) {
      this.userService.registerUser(this.registrationForm.value).subscribe({
        next: () => {
          alert('User registered successfully');
          this.router.navigate(['/login']);
        }
      })
    } else {
      alert('Error valid user details!');
    }

  }

  loginUser() {
    if (this.loginForm.valid) {
      this.userService.loginUser(this.loginForm.value.id).subscribe(res => {
        this.userData = res;
        console.log(this.userData);
        console.log(this.userData.userPassword, this.loginForm.value.userPassword);
        if (this.userData.userPassword === this.loginForm.value.userPassword) {
          if (this.userData.isActive) {
            sessionStorage.setItem('email', this.userData.id);
            sessionStorage.setItem('role', this.userData.role);
            this.router.navigate(['user']);
          } else {
            alert('Inactive User....Please contact admin');
          }
        } else {
          alert('Invalid Credentials');
        }
      });
    }
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.visible = !this.visible;
  }

  change(e: boolean) {
    this.login = e;
  }

}

