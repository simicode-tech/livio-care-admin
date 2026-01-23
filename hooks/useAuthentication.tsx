"use client"
import { useToken, useUser } from "../store";


export const useAuthenticated = () => {
  const token = useToken();
  const user = useUser();

  return typeof token === "string" && user !== null;
};
