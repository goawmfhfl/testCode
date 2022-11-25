import axios from "axios";

const deleteImageUrl = async (imageUrl: string) => {
  try {
    const response: { data: { result: boolean } } = await axios.delete(
      "https://dev.chopsticks-store.com/upload",
      {
        data: {
          url: imageUrl.toString(),
        },
      }
    );

    if (!response.data.result) {
      console.log("이미지 삭제 서버 에러", response);

      return {
        ok: false,
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
  }
};

export default deleteImageUrl;
