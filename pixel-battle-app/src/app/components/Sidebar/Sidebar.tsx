"use client";

import { useGlobalState } from "@/app/context/GlobalProvider";
import Authentification from "../Authentification/Authentification";
import Timer from "../Timer/Timer";
import styled from "styled-components";

export default function Sidebar() {
  const { isAloowedToPlace, theme } = useGlobalState();

  return (
    <SidebarStyle theme={theme} className="sidebar-wrapper">
      <Authentification />
      {!isAloowedToPlace && <Timer />}
    </SidebarStyle>
  );
}

const SidebarStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
`;
