// Lấy userId (sub) từ accessToken JWT
export function getUserIdFromToken(token: string): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('JWT payload for userId:', payload); // DEBUG
    return (
      payload.sub ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      payload.id ||
      null
    );
  } catch {
    return null;
  }
}
export const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    const payload = parts[1];
    
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    const decodedPayload = atob(paddedPayload);
    
    const parsedPayload = JSON.parse(decodedPayload);
    
    return parsedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserRoleFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return payload.role || payload.Role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};

export const getUserEmailFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return payload.email || payload.Email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
};
