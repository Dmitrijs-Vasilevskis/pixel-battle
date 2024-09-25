"use client";

import { useGlobalState } from "@/app/context/GlobalProvider";
import React, { useEffect } from "react";
import styled from "styled-components";

export default function Timer() {
  const {
    cooldown,
    setCooldown,
    setIsAllowedToPlace,
    isAloowedToPlace,
    theme,
  } = useGlobalState();

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setCooldown((prevTime: number) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          setIsAllowedToPlace(true);

          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isAloowedToPlace]);

  return (
    <TimerStyle theme={theme} className="timer">
      <p>Cooldown: {cooldown}</p>
    </TimerStyle>
  );
}

const TimerStyle = styled.div`
  display: flex;
  align-self: center;

  p {
    color: ${(props) => props.theme.colorGrey2};
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    background-color: ${(props) => props.theme.colorBgOpacity};
    border-radius: 0.5rem;
  }
`;
