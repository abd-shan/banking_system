const STORAGE_KEY = 'BANK_AUTH';
const ROLE_KEY = 'USER_ROLE';
const NAME_KEY = 'USER_NAME';

export type TokenMap = Record<number, string>;
interface AuthStorage { activeAccountNumber: number | null; tokens: TokenMap; }

function readStorage(): AuthStorage {
    if (typeof window === 'undefined') return { activeAccountNumber: null, tokens: {} };
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? JSON.parse(raw) : { activeAccountNumber: null, tokens: {} }; }
    catch { return { activeAccountNumber: null, tokens: {} }; }
}

export const tokenStorage = {
    getActiveToken: () => {
        const data = readStorage();
        return data.activeAccountNumber ? data.tokens[data.activeAccountNumber] : null;
    },
    getActiveRole: () => typeof window !== 'undefined' ? localStorage.getItem(ROLE_KEY) : null,
    getActiveName: () => typeof window !== 'undefined' ? localStorage.getItem(NAME_KEY) : null,
    getActiveAccountNumber: () => readStorage().activeAccountNumber,
    hasToken: (num: number) => Boolean(readStorage().tokens[num]),

    saveToken(accountNumber: number, token: string, role: string, fullName: string) {
        const authData = readStorage();
        authData.tokens[accountNumber] = token;
        authData.activeAccountNumber = accountNumber;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
        localStorage.setItem(ROLE_KEY, role);
        localStorage.setItem(NAME_KEY, fullName);
    },

    switchAccount(accountNumber: number | null) {
        const data = readStorage();
        data.activeAccountNumber = accountNumber;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    clearAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(NAME_KEY);
    },
};