import { authenticationService } from '../_Services/AuthenticationService';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue.data;

    if (currentUser && currentUser.token) {
        return {headers: {'Authorization' : `Bearer ${currentUser.token}` }};
    } else {
        return {};
    }
}