"use client";

import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import styled from "styled-components";
import toast from "react-hot-toast";
import Image from "next/image";
import { useGlobalState } from "@/app/context/GlobalProvider";
import Button from "../Button/Button";
import { login, logout } from "@/app/utils/icons";

export default function Authentification() {
  const { theme } = useGlobalState();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleClick = () => {
    if (user) {
      toast.success("You have been signed out");
      signOut();
    } else {
      window.location.href = "/sign-in";
    }
  };

  const { firstName, imageUrl } = user || {
    firstName: "",
    imageUrl: "",
  };

  return (
    <AuthentificationStyled theme={theme}>
      {user && (
        <div className="sidebar-profile">
          {/* <div className="profile-overlay"></div> */}
          <div className="image">
            <Image src={`${imageUrl}`} alt="avatar" width={70} height={70} />
          </div>
          <h3>{firstName}</h3>
        </div>
      )}
      <Button
        type={"button"}
        text={user ? "Sign out" : "Sign in"}
        icon={user ? logout : login}
        background={theme.colorBgOpacity}
        click={handleClick}
      />
    </AuthentificationStyled>
  );
}

const AuthentificationStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .sidebar-profile {
    padding: 1rem 0.8rem;
    position: relative;
    cursor: pointer;
    font-weight: 500;
    color: ${(props) => props.theme.colorGrey0};
    background: ${(props) => props.theme.colorBgOpacity};
    border-radius: 1rem;
    border: 2px solid ${(props) => props.theme.borderColor2};
    display: flex;
    gap: .5rem;

    .profile-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
      z-index: 0;
      background: ${(props) => props.theme.colorBg3};
      transition: all 0.55s linear;
      border-radius: 1rem;
      border: 2px solid ${(props) => props.theme.borderColor2};

      opacity: 0.2;
    }

    h3 {
      font-size: 1.2rem;
      display: flex;
      color: ${(props) => props.theme.colorGrey2};
      flex-direction: column;
      align-self: center;
      line-height: 1.4rem;
    }

    .image {
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      transition: all 0.5s ease;
      border-radius: 100%;

      width: 70px;
      height: 70px;

      img {
        border-radius: 100%;
        transition: all 0.5s ease;
      }
    }
  }

  button {
    pointer-events: auto;
  }
`;
