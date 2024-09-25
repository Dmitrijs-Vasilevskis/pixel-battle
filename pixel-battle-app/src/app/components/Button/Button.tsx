"use client";

import { useGlobalState } from "@/app/context/GlobalProvider";
import styled from "styled-components";

interface ButtonProps {
  icon?: React.ReactNode;
  text?: string;
  type?: "button" | "submit" | "reset" | undefined;
  click?: () => void;
  background?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  border?: string;
}

export default function Button({
  icon,
  text,
  type,
  click,
  background,
  padding,
  fontSize,
  fontWeight,
  borderRadius,
  border,
}: ButtonProps) {
  const { theme } = useGlobalState();

  return (
    <ButtonStyle
      theme={theme}
      type={type}
      onClick={click}
      style={{
        background: background,
        padding: padding || "0.5rem 1rem",
        fontSize: fontSize,
        fontWeight: fontWeight,
        borderRadius: borderRadius || "0.5rem",
        border: border || "none",
      }}
    >
      {icon && icon}
      {text}
    </ButtonStyle>
  );
}

const ButtonStyle = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colorGrey2};
    font-weight: 500;
    z-index: 5;
    cursor: pointer;
    transition: all 0.55s ease-in-out;

  i {
    margin-right: 1rem;
    color: ${(props) => props.theme.colorGrey2};
    font-size: 1.5rem;
    transition: all 0.55s ease-in-out;
  }

  &:hover {
    color: ${(props) => props.theme.colorGrey0};
    i {
      color: ${(props) => props.theme.colorGrey0};
    }
  }
`;
