import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { CurrencyPayload, ResponseRefParamDto } from "@/types";

interface useCurrenciesProps {
  enabled?: boolean;
}

export const useCurrencies = (
  { enabled }: useCurrenciesProps = { enabled: true },
) => {
  const {
    data: currenciesResp,
    isFetching: isCurrenciesPending,
    refetch: refetchCurrencies,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: () =>
      api.referenceTypes.refParam.findAll({
        filter: `refTypeId||$eq||currency`,
      }),
    enabled,
  });

  const currencies = React.useMemo(() => {
    if (!currenciesResp) return [];
    return currenciesResp as ResponseRefParamDto<CurrencyPayload>[];
  }, [currenciesResp]);

  return {
    currencies,
    isCurrenciesPending,
    refetchCurrencies,
  };
};
