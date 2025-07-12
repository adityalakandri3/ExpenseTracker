import { Query, useQuery } from "@tanstack/react-query";
import { STATS } from "../query-keys/QueryKeys";
import { stats } from "../../../api/functions/stats";

export const useStatsQuery = () => {
  return useQuery({
    queryKey: [STATS],
    queryFn:stats
  });
};
