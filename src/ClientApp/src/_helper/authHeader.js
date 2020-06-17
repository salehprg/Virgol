import { authenticationService } from '../_Services/AuthenticationService';

export function authHeader(contentType = 'application/json') {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue.data;

    if (currentUser && currentUser.token) {
        return {headers: {
            'Authorization' : `Bearer ${currentUser.token}`,
            'content-type' : contentType
        }};
    } else {
        return {};
    }
}