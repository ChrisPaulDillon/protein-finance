import React, { useEffect, useRef } from "react";
import CountUp from "react-countup";
import { Text, TextProps } from "@pancakeswap/uikit";
import { Stack } from "@chakra-ui/react";

interface DashboardCardYieldProps extends TextProps {
  value: number;
  decimals?: number;
  unit?: string;
  isDisabled?: boolean;
  prefix?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const DashboardCardYield: React.FC<DashboardCardYieldProps> = ({
  value,
  color = "text",
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  ...props
}) => {
  const previousValue = useRef(0);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return (
    <Stack isInline p={2}>
      <Text
        color={unit === " USD" ? "green" : "white"}
        onClick={onClick}
        {...props}
      >
        {" "}
        {prefix && <span>{prefix}</span>}
        <CountUp
          start={previousValue.current}
          end={value}
          decimals={decimals}
          duration={1}
          separator=","
        />
        {unit && <span>{unit}</span>}
      </Text>
    </Stack>
  );
};

export default DashboardCardYield;
