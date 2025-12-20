export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    TELLER = 'TELLER',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN',
}

// Define the hierarchy of roles (cumulative permissions)
// A role can access everything roles below it can access.
const ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.CUSTOMER]: 1,
    [UserRole.TELLER]: 2,
    [UserRole.MANAGER]: 3,
    [UserRole.ADMIN]: 4,
};

/**
 * Checks if a user's role meets the minimum required role for access.
 * The roles are cumulative: ADMIN > MANAGER > TELLER > CUSTOMER.
 *
 * @param userRole The role of the currently logged-in user.
 * @param requiredRole The minimum role required to access a feature.
 * @returns boolean
 */
export function hasRequiredRole(userRole: string, requiredRole: UserRole): boolean {
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    if (userLevel === undefined || requiredLevel === undefined) {
        console.error(`Invalid role provided: UserRole=${userRole}, RequiredRole=${requiredRole}`);
        return false;
    }

    // User's level must be greater than or equal to the required level
    return userLevel >= requiredLevel;
}