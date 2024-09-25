"use client";

import { SignIn } from "@clerk/nextjs";
import React from "react";
import styled from "styled-components";

export default function page() {
  return (
    <PageStyled>
      <SignIn routing="hash"></SignIn>
    </PageStyled>
  );
}

const PageStyled = styled.div`
  display: flex;
  justify-content: center;
`;

