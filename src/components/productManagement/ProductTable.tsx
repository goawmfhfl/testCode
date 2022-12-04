import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { useMutation, useReactiveVar } from "@apollo/client";

import { tableData } from "@cache/productManagement/table";
import {
  filterOptionVar,
  showHasServerErrorModal,
} from "@cache/productManagement";
import {
  checkAllBoxStatusVar,
  checkedProductIdsVar,
  commonFilterOptionVar,
  loadingSpinnerVisibilityVar,
  systemModalVar,
  pageNumberListVar,
  paginationVisibilityVar,
} from "@cache/index";
import { ProductStatus, productStatus, productType } from "@constants/product";
import {
  GET_ALL_PRODUCTS_BY_SELLER,
  ProductsType,
} from "@graphql/queries/getAllProductsBySeller";
import {
  ChangeProductsInfoBySellerInputType,
  ChangeProductsInfoBySellerType,
  CHANGE_PRODUCTS_INFO_BY_SELLER,
} from "@graphql/mutations/changeProductsInfoBySeller";
import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import { TableType } from "@models/index";
import useLazyProducts from "@hooks/product/useLazyProducts";
import { getDiscountedPrice } from "@utils/product/form/index";
import {
  ThContainer,
  Th,
  TdContainer,
  Tr,
  Td,
  TableContainer,
} from "@components/common/table/Table";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import Checkbox from "@components/common/input/Checkbox";
import NoDataContainer from "@components/common/table/NoDataContainer";
import Loading from "@components/common/table/Loading";

const ProductTable = () => {
  const { loading, error, data, getProducts } = useLazyProducts();
  const { page, skip, query } = useReactiveVar(commonFilterOptionVar);
  const { status } = useReactiveVar(filterOptionVar);

  const checkedProductIds: Array<number> = useReactiveVar(checkedProductIdsVar);
  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);

  const [products, setProducts] = useState<Array<ProductsType>>([]);
  const [isCheckedList, setIsCheckedList] = useState<{
    [key: string]: { isChecked: boolean };
  }>({});

  const [changeProductStatus] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: { input: { page, skip, status, query } },
      },
      "GetAllProductsBySeller",
    ],
  });

  const changeAllCheckBoxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsCheckedList = JSON.parse(JSON.stringify(isCheckedList)) as {
      [key: string]: { isChecked: boolean };
    };
    checkAllBoxStatusVar(e.target.checked);

    if (e.target.checked) {
      Object.keys(newIsCheckedList).forEach((key) => {
        newIsCheckedList[key] = { isChecked: true };
      });

      const checkedProductIds = Object.keys(newIsCheckedList).map((id) =>
        Number(id)
      );

      checkedProductIdsVar(checkedProductIds);
      setIsCheckedList(newIsCheckedList);
    }

    if (!e.target.checked) {
      Object.keys(newIsCheckedList).forEach((key) => {
        newIsCheckedList[key] = { isChecked: false };
      });

      checkedProductIdsVar([]);
      setIsCheckedList(newIsCheckedList);
    }
  };

  const changeSingleCheckBoxHandler =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newIsCheckedList = JSON.parse(JSON.stringify(isCheckedList)) as {
        [key: string]: { isChecked: boolean };
      };

      if (e.target.checked) {
        newIsCheckedList[id].isChecked = true;
        setIsCheckedList(newIsCheckedList);
        checkedProductIdsVar([...checkedProductIds, id]);
      }

      if (!e.target.checked) {
        newIsCheckedList[id].isChecked = false;
        setIsCheckedList(newIsCheckedList);

        const isCheckedList = checkedProductIds.filter(
          (selectedId) => selectedId === id
        );

        if (isCheckedList) {
          const checkedListIndex = checkedProductIds.findIndex(
            (selectedId) => selectedId === id
          );

          checkedProductIdsVar([
            ...checkedProductIds.slice(0, checkedListIndex),
            ...checkedProductIds.slice(checkedListIndex + 1),
          ]);
        }
      }
    };

  const changeSingleSaleStatusHandler =
    (id: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        confirmButtonVisibility: true,
        cancelButtonVisibility: true,
        description: (
          <>
            선택하신 상품을
            <br />
            {productType[value] === productType.ON_SALE &&
              `${productType.ON_SALE}으로 변경하시겠습니까?`}
            {productType[value] === productType.STOP_SALE &&
              `${productType.STOP_SALE}으로 변경하시겠습니까?`}
            {productType[value] === productType.SOLD_OUT &&
              `${productType.SOLD_OUT}로 변경하시겠습니까?`}
          </>
        ),
        confirmButtonClickHandler: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            loadingSpinnerVisibilityVar(true);

            const {
              data: {
                changeProductsInfoBySeller: { ok, error },
              },
            } = await changeProductStatus({
              variables: {
                input: {
                  productIds: [id],
                  productStatus: value,
                },
              },
            });

            if (ok) {
              loadingSpinnerVisibilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                description: (
                  <>
                    {productType[value] === productType.ON_SALE &&
                      `${productType.ON_SALE}으로 변경되었습니다.`}
                    {productType[value] === productType.STOP_SALE &&
                      `${productType.STOP_SALE}으로 변경되었습니다.`}
                    {productType[value] === productType.SOLD_OUT &&
                      `${productType.SOLD_OUT}로 변경되었습니다.`}
                  </>
                ),

                confirmButtonClickHandler: () => {
                  checkAllBoxStatusVar(false);
                  checkedProductIdsVar([]);

                  systemModalVar({
                    ...systemModalVar(),
                    isVisible: false,
                  });
                },
              });
            }

            if (error) {
              loadingSpinnerVisibilityVar(false);
              showHasServerErrorModal(error, "판매상태 변경");
            }
          })();
        },
        cancelButtonClickHandler: () => {
          systemModalVar({
            ...systemModalVar(),
            isVisible: false,
          });
        },
      });
    };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getProducts({
        variables: { input: { page, skip, status, query } },
      });
    })();
  }, [page, skip, status, query]);

  useEffect(() => {
    const totalPages: number = data?.getAllProductsBySeller.totalPages;
    const products: Array<ProductsType> = data?.getAllProductsBySeller.products;
    const checkedList: {
      [key: string]: { isChecked: boolean };
    } =
      products?.reduce((acc, cur) => {
        acc[cur.id] = { isChecked: false };
        return acc;
      }, {}) || {};

    pageNumberListVar(
      Array(totalPages)
        .fill(null)
        .map((_, index) => index + 1)
    );

    setProducts(products);
    setIsCheckedList(checkedList);
    checkedProductIdsVar([]);
    checkAllBoxStatusVar(false);
  }, [data]);

  useEffect(() => {
    paginationVisibilityVar(loading || error);
  }, [loading, error]);

  useEffect(() => {
    commonFilterOptionVar({ ...commonFilterOptionVar(), page: 1 });
  }, [query]);

  return (
    <TableContainer type={TableType.FIX}>
      <ThContainer>
        {tableData.map(({ id, label, width, className }) => (
          <Th key={`th-${id}`} width={width} className={className}>
            {label === "checkBox" ? (
              <Checkbox
                onChange={changeAllCheckBoxHandler}
                checked={checkAllBoxStatus}
              />
            ) : (
              label
            )}
          </Th>
        ))}
      </ThContainer>

      {loading && <Loading />}

      {!loading && products?.length !== 0 ? (
        <TdContainer>
          {products?.map(
            ({
              id: productId,
              name,
              category,
              originalPrice,
              discountAmount,
              discountMethod,
              quantity,
              status,
              thumbnail,
            }) => {
              const discountAppliedPrice =
                discountAmount && discountMethod
                  ? Number(
                      getDiscountedPrice(
                        originalPrice,
                        discountAmount,
                        discountMethod
                      )
                    ).toLocaleString("ko-KR") + " ₩"
                  : "-";

              const firstCategory = category?.parent?.name
                ? category.parent.name
                : "-";
              const secondCategory = category?.name ? category.name : "-";
              const thirdCategory = category?.children?.name
                ? category.children.name
                : "-";

              const rateOfDiscount =
                discountMethod && discountAmount
                  ? `${discountAmount.toLocaleString("ko-KR")} ${
                      discountMethod === "PERCENT" ? "%" : "₩"
                    }`
                  : "-";

              const originalPriceToWonSign = `${originalPrice.toLocaleString(
                "ko-KR"
              )} ₩`;

              return (
                <Tr key={`product-${productId}-row`}>
                  <TableData
                    width={tableData[0].width}
                    className={tableData[0].className}
                  >
                    <Checkbox
                      onChange={changeSingleCheckBoxHandler(productId)}
                      checked={isCheckedList[productId]?.isChecked || false}
                    />
                  </TableData>
                  <TableData
                    width={tableData[1].width}
                    className={tableData[1].className}
                  >
                    {productId}
                  </TableData>
                  <TableData
                    width={tableData[2].width}
                    className={tableData[2].className}
                  >
                    <ProductThumbNailWrapper>
                      <ProductThumbNail src={thumbnail} />
                    </ProductThumbNailWrapper>
                    <ProductName>
                      <Link to={`/product/${productId}`}>{name}</Link>
                    </ProductName>
                  </TableData>
                  <TableData
                    width={tableData[3].width}
                    className={tableData[3].className}
                  >
                    {firstCategory}
                  </TableData>
                  <TableData
                    width={tableData[4].width}
                    className={tableData[4].className}
                  >
                    {secondCategory}
                  </TableData>
                  <TableData
                    width={tableData[5].width}
                    className={tableData[5].className}
                  >
                    {thirdCategory}
                  </TableData>
                  <TableData
                    width={tableData[6].width}
                    className={tableData[6].className}
                  >
                    {originalPriceToWonSign}
                  </TableData>
                  <TableData
                    width={tableData[7].width}
                    className={tableData[7].className}
                  >
                    {rateOfDiscount}
                  </TableData>
                  <TableData
                    width={tableData[8].width}
                    className={tableData[8].className}
                  >
                    {discountAppliedPrice}
                  </TableData>
                  <TableData
                    width={tableData[9].width}
                    className={tableData[9].className}
                  >
                    {quantity}
                  </TableData>
                  <TableData
                    width={tableData[10].width}
                    className={tableData[10].className}
                  >
                    <Dropdown
                      onChange={changeSingleSaleStatusHandler(productId)}
                      arrowSrc={triangleArrowSvg}
                      value={status}
                      sizing={"medium"}
                      width={"146px"}
                      disabled={status === ProductStatus.TEMPORARY}
                    >
                      {productStatus.map(({ label, value }) => (
                        <Option
                          key={`product-${productId}-status-${label}`}
                          value={value}
                          hidden={value === ProductStatus.DEFAULT}
                        >
                          {label}
                        </Option>
                      ))}
                    </Dropdown>
                  </TableData>
                </Tr>
              );
            }
          )}
        </TdContainer>
      ) : (
        !loading && (
          <NoDataContainer type={TableType.FIX}>
            {query === "" ? (
              <>
                아직 들어온 <br /> 상품이 없습니다.
              </>
            ) : (
              <>
                검색어와 일치하는 <br /> 상품이 없습니다.
              </>
            )}
          </NoDataContainer>
        )
      )}
    </TableContainer>
  );
};

const TableData = styled(Td)`
  &.name {
    justify-content: flex-start;
  }
`;

const ProductThumbNailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 56px;
  height: 40px;

  border-right: 1px solid ${({ theme: { palette } }) => palette.grey500};
`;

const ProductThumbNail = styled.img`
  width: 24px;
  height: 24px;
`;

const ProductName = styled.span`
  display: block;

  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default ProductTable;