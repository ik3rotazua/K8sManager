import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  AuthenticationStateDto as AuthenticationState,
  PolicyMenu,
  RoleManagementPolicies
} from '../../api/models';
import { AccountService } from '../../api/services';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';

export type AppPolicy = PolicyMenu | RoleManagementPolicies;
type This = AuthService;

@Injectable({
  providedIn: 'root'
})
export class AuthService
  extends DestroySubscriptions {
  private accountProfile?: AuthenticationState;
  private _$profileChange = new BehaviorSubject<This['accountProfile']>(this.accountProfile);

  $profileChange = this._$profileChange
    .pipe(takeUntil(this.$onDestroyed));
  /** Wether the account profile has been recovered at least once */
  _isInitialized = false;
  get isAnonymous() { return this.accountProfile == null || this.accountProfile.isAnonymous; }

  constructor(
    private readonly accSV: AccountService,
  ) {
    super();
  }


  resetAccountProfile() {
    this.accountProfile = null;
    this._$profileChange.next(this.accountProfile);
  }

  async refreshAccountProfile() {
    try {
      const apiCall = this.accSV.apiAccountProfileGet$Json();
      const data = await firstValueFrom(apiCall);

      this.accountProfile = data;
      this._$profileChange.next(this.accountProfile);
    } catch { }

    this._isInitialized = true;
  }

  async isInPolicy(policy: AppPolicy) {
    if (this.accountProfile == null || this.accountProfile.permissions == null) {
      await this.refreshAccountProfile().catch(() => { });
    }
    const isInPolicy = this.isInPolicyInstant(policy);
    return isInPolicy;
  }

  isInPolicyInstant(policy: AppPolicy) {
    return this.accountProfile != null
      && this.accountProfile.permissions != null
      && this.accountProfile.permissions.indexOf(policy) >= 0;
  }

  getDisplayName() {
    return this.accountProfile?.displayName;
  }


  async logout() {
    // // JWT does not need to call to server. Instead, just
    // // delete the JWT token.
    // this.tokenSV.setStoredToken(null);

    // const url = AccountService.ApiAccountLogoutPostPath;
    // location.
    const apiCall = this.accSV.apiAccountLogoutGet();
    await firstValueFrom(apiCall);

    await this.refreshAccountProfile();
  }
}
