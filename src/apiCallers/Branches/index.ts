"use server";

import { mockRequest } from "@/lib/mockRequest";
import type { BranchSchemaType } from "@/views/branches/helper";
import { sampleData } from "@/views/requestedBranches/helper";

import { fetcher } from "..";

export const getBranchListAPI = async (sampleData?: any) => {
  // return fetcher("package-court")
  return fetcher("branch");
};

export const postBranchListAPI = async (data: BranchSchemaType) => {
  return fetcher("branch", {
    body: JSON.stringify(data),
    method: "POST",
  });
};
export const searchBranchesAPI = async (searchParams: { keyword: string }) => {
  return fetcher("branch/search", {
    method: "POST",
    body: JSON.stringify(searchParams),
  });
};
export const putBranchListAPI = async (data: BranchSchemaType) => {
  // return fetcher("package-court", {
  //   body: JSON.stringify(data),
  //   method: "POST",
  // });

  return mockRequest(sampleData);
};

export const getBranchByIdAPI = async (slug: string) => {
  const rest = await fetcher(`branch/get-by-id/${slug}`, {
    method: "GET",
  });

  return rest;
};
