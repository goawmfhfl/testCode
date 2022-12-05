import axios from "axios";

const bizm = axios.create({
  baseURL: process.env.REACT_APP_BIZM_PRODUCT_URL,
  headers: { userid: "chopsticks" },
});

const formatNumber = (number: string) => {
  return "+82" + number.slice(1);
};

interface Response {
  data: Array<{
    code: string;
    data: string;
    message: string;
    originMessage: string | null;
  }>;
}

async function sendKakaoMessage(
  phoneNumber: string,
  message: string
): Promise<Response> {
  const response: Response = await bizm.post(`/v2/sender/send`, [
    {
      message_type: "AT",
      phn: formatNumber(phoneNumber),
      profile: process.env.REACT_APP_BIZM_PROFILE,
      reserveDt: "00000000000000",
      tmplId: "chopsticks_05",
      msg: message,
    },
  ]);

  return response;
}

export { sendKakaoMessage };
