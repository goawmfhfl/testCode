import ProductImageContainer from "@components/productForm/imageSection/common/ProductImageContainer";
import ProductImage from "@components/productForm/imageSection/common/ProductImage";
import AddImageInput from "@components/productForm/imageSection/common/AddImageInput";
import AddImageInputWrapper from "@components/productForm/imageSection/common/AddImageInputWrapper";

import { descriptionImagesVar } from "@cache/productForm/descriptionImages";
import { bytesToMegaBytes, convertFileToBase64 } from "@utils/index";

const DescriptionImage = ({ id, url }: { id: string; url: string }) => {
  const handleImageChange =
    (id: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const [image] = e.target.files;
      const size: number = image.size;

      const previousSize: number = descriptionImagesVar().reduce(
        (total: number, { size }: { size: number }) => total + size,
        0
      );

      if (bytesToMegaBytes(previousSize + size) > 50) {
        alert("총 50메가 이하의 상세페이지 이미지를 업로드 할 수 있습니다");

        return;
      }

      if (bytesToMegaBytes(size) > 10) {
        alert("10메가 이하의 파일을 선택해주세요");

        return;
      }

      const url = await convertFileToBase64(image);

      const selectedImageIndex = descriptionImagesVar().findIndex((img) => {
        return img.id === id;
      });

      const updated = [...descriptionImagesVar()];
      updated[selectedImageIndex].file = image;
      updated[selectedImageIndex].filename = image.name;
      updated[selectedImageIndex].url = url;
      updated[selectedImageIndex].size = size;

      descriptionImagesVar(updated);
    };

  const handleRemoveImageButton = (url: string) => () => {
    descriptionImagesVar([
      ...descriptionImagesVar().filter((img) => img.url !== url),
    ]);
  };

  return (
    <ProductImageContainer>
      {url ? (
        <ProductImageContainer>
          <ProductImage
            imageSource={url}
            handleImageInputChange={handleImageChange(id)}
            handleRemoveButtonClick={handleRemoveImageButton(url)}
          />
        </ProductImageContainer>
      ) : (
        <AddImageInputWrapper>
          {/* eslint-disable-next-line */}
          <AddImageInput name={id} onChange={handleImageChange(id)} />
        </AddImageInputWrapper>
      )}
    </ProductImageContainer>
  );
};

export default DescriptionImage;
