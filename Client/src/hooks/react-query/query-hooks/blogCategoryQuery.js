import { useQuery } from "@tanstack/react-query";
import { BLOG_CATEGORY } from "../query-keys/QueryKeys";
import {
  filterBlogCategory,
  getBlogCategory,
} from "../../../api/functions/blog";

export const useGetBlogCategory = () => {
  return useQuery({
    queryKey: [BLOG_CATEGORY],
    queryFn: getBlogCategory,
  });
};

export const useFilterBlogCategory = (categoryId) => {
  return useQuery({
    queryKey: ["filteredPosts", categoryId],
    queryFn: () => filterBlogCategory(categoryId),
    enabled: !!categoryId, 
  });
};
