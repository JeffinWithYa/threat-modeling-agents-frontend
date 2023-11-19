"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";


export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("80e50631-42c4-4acf-b7b4-9b5f7fa3fe00");
  }, []);

  return null;
};
