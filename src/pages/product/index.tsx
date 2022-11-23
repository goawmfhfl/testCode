import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useMutation, useReactiveVar } from "@apollo/client";

import { GET_ALL_PRODUCTS_BY_SELLER } from "@graphql/queries/getAllProductsBySeller";
import {
  ChangeProductsInfoBySellerInputType,
  ChangeProductsInfoBySellerType,
  CHANGE_PRODUCTS_INFO_BY_SELLER,
} from "@graphql/mutations/changeProductsInfoBySeller";

import { showHasServerErrorModal } from "@cache/productManagement";
import {
  systemModalVar,
  filterOptionVar,
  pageNumberListVar,
  checkAllBoxStatusVar,
  LoadingSpinnerVisivilityVar,
  checkedProductIdsVar,
} from "@cache/index";
import { tableData } from "@cache/productManagement/table";

import triangleArrowSvg from "@icons/arrow-triangle-small.svg";
import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Checkbox from "@components/common/input/Checkbox";
import FilterBar from "@components/productRegistration/productManagement/FilterBar";
import Pagination from "@components/productRegistration/productManagement/Pagination";
import Controller from "@components/productRegistration/productManagement/Controller";
import NoDataContainer from "@components/common/table/NoDataContainer";
import {
  SelectInput as Dropdown,
  OptionInput as Option,
} from "@components/common/input/Dropdown";
import {
  ThContainer,
  Th,
  TbContainer,
  Tr,
  Td,
  TableContainer,
} from "@components/common/table/Table";
import { HeaderNames } from "@constants/index";
import { TableType } from "@models/index";

import { getDiscountedPrice } from "@utils/calculator";
import useLazyProducts from "@hooks/useLazyProducts";

const saleStatusList = [
  { id: 0, label: "DEFAULT", name: "판매상태 변경" },
  { id: 1, label: "ON_SALE", name: "판매중" },
  { id: 2, label: "STOP_SALE", name: "숨김" },
  { id: 3, label: "SOLD_OUT", name: "품절" },
];

const Product = () => {
  const {
    loading,
    error,
    products,
    setProducts,
    isCheckedList,
    setIsCheckedList,
    totalPages,
    getProducts,
  } = useLazyProducts();

  const filterOption = useReactiveVar(filterOptionVar);
  const { page, skip, status, query } = filterOption;

  const checkedProductIds: Array<number> = useReactiveVar(checkedProductIdsVar);

  const checkAllBoxStatus: boolean = useReactiveVar(checkAllBoxStatusVar);

  const [updateProductsStatus] = useMutation<
    ChangeProductsInfoBySellerType,
    ChangeProductsInfoBySellerInputType
  >(CHANGE_PRODUCTS_INFO_BY_SELLER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    refetchQueries: [
      {
        query: GET_ALL_PRODUCTS_BY_SELLER,
        variables: { input: filterOption },
      },
      "GetAllProductsBySeller",
    ],
  });

  // 단일 상태 변경
  const changeSingleSaleStatusHandler =
    (id: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const saleStatus = {
        ON_SALE: "판매중",
        STOP_SALE: "숨김",
        SOLD_OUT: "품절",
      };

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
            {saleStatus[value] === "판매중" && "판매중으로 변경하시겠습니까?"}
            {saleStatus[value] === "숨김" && "숨김으로 변경하시겠습니까?"}
            {saleStatus[value] === "품절" && "품절로 변경하시겠습니까?"}
          </>
        ),
        confirmButtonClickHandler: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            LoadingSpinnerVisivilityVar(true);

            const {
              data: {
                changeProductsInfoBySeller: { ok, error },
              },
            } = await updateProductsStatus({
              variables: {
                input: {
                  productIds: [id],
                  productStatus: value,
                },
              },
            });

            if (ok) {
              LoadingSpinnerVisivilityVar(false);
              systemModalVar({
                ...systemModalVar(),
                isVisible: true,
                confirmButtonVisibility: true,
                cancelButtonVisibility: false,
                description: (
                  <>
                    {saleStatus[value] === "판매중" &&
                      "판매중으로 변경되었습니다."}
                    {saleStatus[value] === "숨김" && "숨김으로 변경되었습니다."}
                    {saleStatus[value] === "품절" && "품절로 변경되었습니다."}
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
              LoadingSpinnerVisivilityVar(false);
              showHasServerErrorModal(error);
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

  // 복수 체크박스
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

  // 단일 체크박스
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

  // 업데이트
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await getProducts({ variables: { input: filterOption } });

      pageNumberListVar(
        Array(totalPages)
          .fill(null)
          .map((_, index) => index + 1)
      );

      checkedProductIdsVar([]);
      checkAllBoxStatusVar(false);
    })();
  }, [page, skip, status, query]);

  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName={HeaderNames.Product as HeaderNames} />
        <FilterBar />
        <Controller />
        <TableContainer>
          <ThContainer>
            {tableData.map(({ id, label, width, className }) => (
              <Th key={id} width={width} className={className}>
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

          {products?.length !== 0 ? (
            <TbContainer>
              {products?.map(
                ({
                  id,
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
                    <Tr key={id}>
                      <ProductManageMentTd
                        width={tableData[0].width}
                        className={tableData[0].className}
                      >
                        <Checkbox
                          onChange={changeSingleCheckBoxHandler(id)}
                          checked={isCheckedList[id]?.isChecked || false}
                        />
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[1].width}
                        className={tableData[1].className}
                      >
                        {id}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[2].width}
                        className={tableData[2].className}
                      >
                        <ProductThumbNailWrapper>
                          <ProductThumbNail src={thumbnail} />
                        </ProductThumbNailWrapper>
                        <ProductName>
                          <Link to={`/product/${id}`} state={{ productId: id }}>
                            {name}
                          </Link>
                        </ProductName>
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[3].width}
                        className={tableData[3].className}
                      >
                        {firstCategory}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[4].width}
                        className={tableData[4].className}
                      >
                        {secondCategory}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[5].width}
                        className={tableData[5].className}
                      >
                        {thirdCategory}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[6].width}
                        className={tableData[6].className}
                      >
                        {originalPriceToWonSign}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[7].width}
                        className={tableData[7].className}
                      >
                        {rateOfDiscount}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[8].width}
                        className={tableData[8].className}
                      >
                        {discountAppliedPrice}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[9].width}
                        className={tableData[9].className}
                      >
                        {quantity}
                      </ProductManageMentTd>
                      <ProductManageMentTd
                        width={tableData[10].width}
                        className={tableData[10].className}
                      >
                        <Dropdown
                          onChange={changeSingleSaleStatusHandler(id)}
                          arrowSrc={triangleArrowSvg}
                          value={status}
                          sizing={"medium"}
                          width={"146px"}
                        >
                          {saleStatusList.map(({ id, label, name }) => (
                            <Option
                              key={id}
                              value={label}
                              hidden={label === "DEFAULT"}
                            >
                              {name}
                            </Option>
                          ))}
                        </Dropdown>
                      </ProductManageMentTd>
                    </Tr>
                  );
                }
              )}
            </TbContainer>
          ) : (
            !loading && (
              <NoDataContainer type={TableType.FIX}>
                검색어와 일치하는
                <br />
                상품이 없습니다.
              </NoDataContainer>
            )
          )}
        </TableContainer>

        {products?.length ? <Pagination /> : <></>}
      </ContentsContainer>
    </Layout>
  );
};

const ProductManageMentTd = styled(Td)`
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

export default Product;
