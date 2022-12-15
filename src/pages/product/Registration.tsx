import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import ProductForm from "@components/productForm";
import { ProductFormValues } from "@models/product";
import resetForm from "@utils/product/form/resetForm";

const ProductRegistration = () => {
  const methods = useForm<ProductFormValues>();

  useEffect(() => {
    resetForm(methods);
  }, []);

  return (
    <FormProvider {...methods}>
      <ProductForm />
    </FormProvider>
  );
};

export default ProductRegistration;
