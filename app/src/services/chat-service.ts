import { request } from "./../utils";
import { getToken } from "./auth-service";

const createHeader = async () => {
  const token = await getToken();

  const payloadHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return payloadHeader;
};

export type Message = {
  id: string;
  subject: string;
  body: string;
  toUserId: string | null;
  channelId: string;
  channelType: string;
  createdBy: string;
  [s:string]: any;
};

export const getChatRoom = async () => {
  const header = await createHeader();
  try {
    const res = await request.get(`/userTenantId`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getMessages = async (): Promise<Message[]>  => {
  const header = await createHeader();

  try {
    const res = await request.get(`/messages`, header);
    return (res.data ?? []) as Message[];
  } catch (e) {
    console.error(e);
  }
  return []
};

export const sendMessage = async (message: Partial<Message>) => {
  const header = await createHeader();
  try {
    const res = await request.post(`/messages`, message, header);
    console.log(res.data)
    return res.data as Message;
  } catch (e) {
    console.error(e);
  }
  return null
};
