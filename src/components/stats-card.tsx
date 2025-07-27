import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { Skeleton } from "@/components/shadcn/skeleton";

type StatsCardProps = {
  title: string;
  value: number | string | null;
  description: string;
  color?: string;
  loading: boolean;
};

export const StatsCard = ({ title, value, description, color, loading }: StatsCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? <Skeleton className="h-6 w-24 mb-1" /> : <div className={`text-2xl font-bold ${color || ""}`}>{value}</div>}
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);
