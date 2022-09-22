import axios from "axios";
import { parseJwt} from "../utils";

const baseURL = "http://localhost:8081";

export const request = axios.create({
  baseURL: baseURL,
  timeout: 1000,
});

const refreshTokenKey = "we_r_token";
const accessTokenKey = "we_a_token";

type Headers = {
  [s: string]: any;
};
type User = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  username: string;
  email: string;
  phone: string | null;
  lastLogin: string | null;
  dob: string | null;
  gender: string | null;
  defaultTenantId: string;
  permissions: string[];
  [x: string]: string | null | number | string[];
};
type AuthTokenReponse = {
  accessToken: string;
  refreshToken: string;
  expires: number;
};
let accessToken: string | null = localStorage.getItem(accessTokenKey);

export async function getToken(refresh = true){
  let token = accessToken;
  if(token){
    // check if it not expire and valid
    const decodedJwt = parseJwt(token)
    if (decodedJwt.exp * 1000 < Date.now()) {
      // code is expire
      //  renew code silently
      let data = await renewAccessToken();
      if(data?.accessToken){
        accessToken = data?.accessToken;
        return accessToken;
      } else {
        return null
      }      
    }
    return accessToken;
  }else if(refresh) {
    // check refresh token 
    // if there then get access token and update it
    let data = await renewAccessToken();
    if(data?.accessToken){
      accessToken = data?.accessToken;
      return accessToken;
    }
  }
  return null
}
const createHeader = async (refresh = true) => {
  const token = await getToken(refresh);

  let tokenHeader: Headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    tokenHeader["Authorization"] = `Bearer ${token}`;
  }
  let payloadHeader = {
    headers: {
      ...tokenHeader,
    },
  };
  return payloadHeader;
};

function setRefreshToken(token: string) {
  localStorage.setItem(refreshTokenKey, token);
}
function setAccessToken(token: string) {
  localStorage.setItem(accessTokenKey, token);
}
export const getAccessTokenFromCode = async ({
  code,
  clientId,
}: {
  code: string;
  clientId: string;
}) => {
  const header = await createHeader();
  try {
    const res = await request.post(`/auth/token`, { code, clientId }, header);
    res.data?.refreshToken && setRefreshToken(res.data?.refreshToken);
    res.data?.accessToken && setAccessToken(res.data?.accessToken);
    if(res.data?.accessToken){
      accessToken = res.data?.accessToken;
    } 
    return res.data as AuthTokenReponse;
  } catch (e) {
    console.error(e);
  }
};

export const getMe = async (): Promise<User | undefined> => {
  const token = await getToken();
  if(!token) return
  const header = await createHeader();
  try {
    const res = await request.get(`/auth/me`, header);
    return res.data as User;
  } catch (e) {
    console.error(e);
  }
};

export const renewAccessToken = async () => {
  const header = await createHeader(false);
  // add device id header
  header.headers.device_id = window.navigator.userAgent;
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if(!refreshToken) return null
  try {
    const res = await request.post(
      `/auth/token-refresh`,
      { refreshToken },
      header
    );
    res.data?.refreshToken && setRefreshToken(res.data?.refreshToken);
    res.data?.accessToken && setAccessToken(res.data?.accessToken);
    return res.data as AuthTokenReponse;
  } catch (e) {
    console.error(e);
  }
};
