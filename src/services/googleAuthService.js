// Google OAuth Service for Expo
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { CONFIG } from '../config';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  // Force using Expo proxy for redirect
  const redirectUri = makeRedirectUri({
    scheme: 'stadiumbook',
    preferLocalhost: false,
    isTripleSlashed: false,
  });

  console.log('Redirect URI:', redirectUri); // للتشخيص

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
    iosClientId: CONFIG.GOOGLE_IOS_CLIENT_ID,
    androidClientId: CONFIG.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  return { request, response, promptAsync, redirectUri };
};

// Fetch user info from Google
export const fetchGoogleUserInfo = async (accessToken) => {
  try {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    const userInfo = await res.json();
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw error;
  }
};

// Decode JWT token to get user info
export const decodeIdToken = (idToken) => {
  try {
    const payload = idToken.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
