import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {
  AxRoute,
  AxRouteData
} from '@efordevelops/ax-toolbox/lib/models-common/route-models';
import { Observable } from 'rxjs';
import {
  AppPolicy as AuthServAppPolicy,
  AuthService
} from '../../services/auth/auth.service';


/** @todo KEEP THIS UPDATED WITH POLICY ENUMS FROM API! */
// export type AppPolicy = undefined;
export type AppPolicy = AuthServAppPolicy;



interface ActivatedRouteSnapshotWithPolicy extends ActivatedRouteSnapshot {
  data: RouteDataWithPolicy;
}

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshotWithPolicy,
  state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  return canActivateChild(route, state);
};

export const canActivateChild: CanActivateChildFn = (
  next: ActivatedRouteSnapshotWithPolicy,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const [router] = [
    inject(Router),
  ];
  const policy: AppPolicy | undefined | null | AppPolicy[] = next.data && next.data.policy;

  let policyJoinMode = PolicyJoinMode.And;
  if (next.data != null && next.data.policyJoinMode != null) {
    policyJoinMode = next.data.policyJoinMode;
  }
  return checkAccess(router, next.toString(), policy, policyJoinMode);
};

export const canMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const [router] = [
    inject(Router),
  ];

  const policy: AppPolicy = route.data && route.data.policy;

  let policyJoinMode = PolicyJoinMode.And;
  if (route.data != null && route.data.policyJoinMode != null) {
    policyJoinMode = route.data.policyJoinMode;
  }
  return checkAccess(
    router,
    ([''].concat(segments.map(s => s.path))).join('/'),
    policy,
    policyJoinMode);
};

const checkAccess = async (
  router: Router,
  path: string, policy?: AppPolicy | undefined | null | AppPolicy[],
  policyJoinMode = PolicyJoinMode.And): Promise<boolean> => {
  // const pAccess = this.accessSV.apiAccessAccessGet$Json({ p: path }).toPromise().catch(() => false);
  let pPermission: Promise<boolean>;
  if (policy == null) {
    pPermission = checkAccessByPolicy(null).catch(() => false);
  } else {
    const appPoliciesParam: AppPolicy[] = [];
    if (policy instanceof Array) {
      appPoliciesParam.push(...policy);
    } else if (policy != null) {
      appPoliciesParam.push(policy);
    }
    pPermission = Promise.all(
      appPoliciesParam.map((p) => checkAccessByPolicy(p)),
    ).then(r => {
      if (policyJoinMode === PolicyJoinMode.And) {
        return Promise.resolve(r.every(result => result === true));
      } else {
        return Promise.resolve(r.find(result => result === true) != null);
      }
    });
  }

  const results = await Promise.all([/*pAccess,*/ pPermission]);
  const canAccess = results.every((success) => success && true);
  if (!canAccess) {
    router.navigate(['/auth'], { queryParams: { ReturnUrl: path } });
  }
  return canAccess;
};

const checkAccessByPolicy = async (policy: AppPolicy | undefined | null): Promise<boolean> => {
  const authSV = inject(AuthService);

  if (policy == null) {
    if (!authSV._isInitialized) {
      await authSV.refreshAccountProfile();
    }
    return !authSV.isAnonymous;
  } else {
    const res = authSV
      .isInPolicy(policy)
      .catch(() => false);
    return res;
  }
};

export declare type AppRoutes = AppRoute[];

export interface AppRoute
  extends AxRoute {
  data?: AppRouteData;
  children?: AppRoutes;
}

/** Alias para `RouteDataWithPolicy` */
export type AppRouteData = RouteDataWithPolicy;

export interface RouteDataWithPolicy
  extends AxRouteData {
  policy?: AppPolicy | AppPolicy[];
  policyJoinMode?: PolicyJoinMode;
  /**
   * Indica si un cambio en el picker de `companyNo`
   * debe lanzar una redirección a la ruta con el nuevo
   * companyNo.
   */
  canChangeCompanyNo?: boolean;
  breadcrumb?: AxRouteData['breadcrumb'] & { translate?: boolean; }
}

export enum PolicyJoinMode {
  And = 0,
  Or = 1,
}
