import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './public/pages/login/login-content/login-content.component';
import {SignUpComponent} from './public/pages/signUp/sign-up-content/sign-up-content.component';
import {UserProfileComponent} from './profiles/pages/user-profile/user-profile.component';
import {PlansContentComponent} from './public/pages/plans/plans-content/plans-content.component';
import {UserEditDialogComponent} from './profiles/pages/user-edit-dialog/user-edit-dialog.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  {path: 'user-profile', component: UserProfileComponent },
  {path: 'plans', component: PlansContentComponent },
  {path: 'edit-profile', component: UserEditDialogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
